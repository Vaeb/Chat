import React from 'react';
import { withApollo } from 'react-apollo';
import map from 'lodash/map';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
// import uniqBy from 'lodash/uniqBy';
// import concat from 'lodash/concat';
import flatten from 'lodash/flatten';
import keyBy from 'lodash/keyBy';

import ViewChat from '../containers/ViewChat';
import { viewQuery } from '../graphql/chat';
import {
    allRolesContext,
    allChannelsContext,
    allUsersContext,
    viewRolesContext,
    viewChannelsContext,
    viewUsersContext,
    nowUserContext,
    nowChannelContext,
    pushUpContext,
    selfMessageContext,
} from '../context/dataContexts';

const sortRoles = roles => roles.sort((a, b) => (a.id === 1 ? 1 : b.position - a.position));
const sortRoleIds = (roles, allRoles) => roles.sort((a, b) => (a === 1 ? 1 : allRoles[b].position - allRoles[a].position));
const sortChannels = channels => channels.sort((a, b) => a.id - b.id);

const toObj = arr =>
    arr.reduce((o, val) => {
        o[val] = true;
        return o;
    }, {});

class ViewChatWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.chatId = String(Math.random());

        this.state = {
            allChannels: {},
            allRoles: {},
            allUsers: {},
            viewChannels: [],
            viewRoles: [],
            viewUsers: [],
            selfMessage: {
                newSelfMessage: (message) => {
                    this.setState(prevState => ({
                        selfMessage: { ...prevState.selfMessage, selfMessageData: [...prevState.selfMessage.selfMessageData, message] },
                    }));
                },
                getSelfMessages: () => {
                    const { selfMessageData } = this.state.selfMessage;
                    if (selfMessageData.length === 0) return selfMessageData;

                    this.setState(prevState => ({ selfMessage: { ...prevState.selfMessage, selfMessageData: [] } }));

                    return selfMessageData;
                },
                selfMessageData: [],
            },
        };

        const {
            setupData,
            props: { history },
        } = this;

        console.log('Creating ViewChatWrapper');

        this.props.client
            .query({
                query: viewQuery,
                fetchPolicy: 'network-only',
            })
            .then(({ loading, data }) => {
                if (loading) {
                    console.log('Message query loading data...');
                    return;
                }

                if (!data || !data.chatData) {
                    console.log('Chat data not found, are you logged in?');
                    history.push('/login');
                }

                setupData(data.chatData);
            })
            .catch((err) => {
                console.log('ChatData error:', err);
                console.log('Chat data not found, are you logged in?');
                history.push('/login');
            });
    }

    componentWillReceiveProps(nextProps) {
        if (this.hasData && this.getNowChannel(nextProps.match.params.channelId, this.state.viewChannels).id !== this.nowChannelId) {
            this.setupView(nextProps);
        }
    }

    getNowChannel = (channelId, viewChannels) => {
        channelId = parseInt(channelId, 10);
        const nowChannel = viewChannels[Math.max(channelId ? findIndex(viewChannels, ['id', channelId]) : 0, 0)];
        return nowChannel;
    };

    // Change data properties from arrays of maps to just arrays
    fixDataProps = (oldData, dataProps = []) => {
        const newData = Object.assign({}, oldData);

        if (dataProps.length > 0) {
            for (let i = 0; i < dataProps.length; i++) {
                const { propName, valueKey } = dataProps[i];
                newData[propName] = map(newData[propName], valueKey);
            }
        }

        return newData;
    };

    addUserRoleData = (user, userRoles, allRoles) => {
        sortRoleIds(userRoles, allRoles);

        const highestRoleId = userRoles[0];
        const highestViewRoleId = userRoles.find(rId => allRoles[rId].view);
        const highestRole = allRoles[highestRoleId];
        const highestViewRole = allRoles[highestViewRoleId];

        user.roles = userRoles;
        user.highestRoleId = highestRoleId;
        user.highestViewRoleId = highestViewRoleId;
        user.position = highestRole.position;
        user.color = highestViewRole.color;
    };

    linkRoles = (allUsers, allRoles) => {
        const allRoleVals = Object.values(allRoles);

        Object.values(allUsers).forEach((user) => {
            const userRoles = [];

            allRoleVals.forEach((role) => {
                if (role.members.includes(user.id)) {
                    userRoles.push(role.id);
                    user.owner = user.owner || role.owner;
                }
            });

            this.addUserRoleData(user, userRoles, allRoles);
        });
    };

    setupData = (chatData) => {
        const { id: nowUserId, allChannels: allChannelsOrig, allRoles: allRolesOrig, allUsers: allUsersOrig } = chatData;

        // /////////////////////////////////////////////// PARSE GRAPHQL DATA //////////////////////////////////////////////////////////////////
        console.log('got allchannels data', allChannelsOrig);
        const { fixDataProps } = this;

        // GraphQL data is read-only
        const allRoles = keyBy(allRolesOrig.slice().map(r => fixDataProps({ ...r, position: r.position || 0 }, [
            { propName: 'members', valueKey: 'id' },
            { propName: 'permissions', valueKey: 'name' },
        ])), 'id');

        const allChannels = keyBy(allChannelsOrig.slice().map((c) => {
            const { channelRoles, default_send, ...props } = c;
            const channel = {
                roles: channelRoles.map(r => r.roleId),
                sendRoles: channelRoles.filter(r => r.send).map(r => r.roleId),
                defaultSend: default_send,
                ...props,
            };
            return channel;
        }), 'id');

        const allUsers = keyBy(allUsersOrig.slice().map(u => fixDataProps(u)), 'id');

        this.linkRoles(allUsers, allRoles);

        Object.values(allChannels).forEach((c) => {
            c.newMessages = !!c.newMessages;
        });

        this.setupPushUps();

        this.nowUserId = nowUserId;
        this.hasData = true;

        console.log('Setup data:', {
            allRoles,
            allChannels,
            allUsers,
        });

        this.setupView(this.props, { allRoles, allChannels, allUsers });
    };

    allStorage = (changeStorage = []) => ({
        allChannels: changeStorage.includes('allChannels') ? Object.assign({}, this.state.allChannels) : undefined,
        allRoles: changeStorage.includes('allRoles') ? Object.assign({}, this.state.allRoles) : undefined,
        allUsers: changeStorage.includes('allUsers') ? Object.assign({}, this.state.allUsers) : undefined,
    });

    getDataEdit = (viewStorage, dataId) => {
        // Get data from viewStorage for editing without needing to call setupView()
        const dataIndex = findIndex(viewStorage, ['id', dataId]);
        if (dataIndex === -1) return null;

        const data = Object.assign({}, viewStorage[dataIndex]);
        viewStorage[dataIndex] = data;

        return data;
    };

    setupPushUps = () => {
        this.pushUpMethods = {
            newChannel: (newChannelData) => {
                // setTimeout(() => {
                console.log('Updating for newChannel', newChannelData);

                const { allChannels } = this.allStorage(['allChannels']);

                const channel = this.fixDataProps(newChannelData, [{ propName: 'roles', valueKey: 'id' }]);
                channel.newMessages = false;

                allChannels[newChannelData.id] = channel;

                this.setupView(this.props, { allChannels });
                // }, 4000);
            },
            newRole: (newRoleData) => {
                console.log('Updating for newRole', newRoleData);

                const { allRoles, allUsers } = this.allStorage(['allRoles', 'allUsers']);

                const role = this.fixDataProps(newRoleData, [
                    { propName: 'members', valueKey: 'id' },
                    { propName: 'permissions', valueKey: 'name' },
                ]);

                allRoles[newRoleData.id] = role;

                this.linkRoles(allUsers, allRoles);

                this.setupView(this.props, { allRoles, allUsers });
            },
            newRoleUser: ({ role: { id: roleId }, user: { id: userId } }) => {
                // setTimeout(() => {
                console.log('Updating for newRoleUser', roleId, userId);

                const { allRoles, allUsers } = this.allStorage(['allRoles', 'allUsers']);

                const role = allRoles[roleId];
                const user = allUsers[userId];

                if (!role || !user) {
                    console.log('newRoleUser error', '| role:', role, '| user:', user);
                }

                if (!role.members.includes(userId)) role.members.push(userId);
                if (!user.roles.includes(roleId)) user.roles.push(roleId);

                user.owner = user.roles.some(rId => allRoles[rId].owner);

                this.addUserRoleData(user, user.roles, allRoles);

                this.setupView(this.props, { allRoles, allUsers });
                // }, 4000);
            },
            remRoleUser: ({ role: { id: roleId }, user: { id: userId } }) => {
                console.log('Updating for remRoleUser', roleId, userId);

                const { allRoles, allUsers } = this.allStorage(['allRoles', 'allUsers']);

                const role = allRoles[roleId];
                const user = allUsers[userId];

                if (!role || !user) {
                    console.log('remRoleUser error', '| role:', role, '| user:', user);
                }

                console.log(typeof userId, typeof role.members[0], typeof roleId, typeof user.roles[0]);

                role.members = role.members.filter(uId => uId !== userId);
                user.roles = user.roles.filter(rId => rId !== roleId);

                user.owner = user.roles.some(rId => allRoles[rId].owner);

                this.addUserRoleData(user, user.roles, allRoles);

                this.setupView(this.props, { allRoles, allUsers });
            },
            newUser: (newUserData) => {
                // setTimeout(() => {
                console.log('Updating for newUser', newUserData);

                const { allRoles, allUsers } = this.allStorage(['allRoles', 'allUsers']);

                const user = this.fixDataProps(newUserData, [{ propName: 'roles', valueKey: 'id' }]);

                if (user.roles.some(rId => allRoles[rId].owner)) user.owner = true;

                this.addUserRoleData(user, user.roles, allRoles);

                allUsers[newUserData.id] = user;

                this.setupView(this.props, { allRoles, allUsers });
                // }, 4000);
            },
            newMessage: ({ channel: { id: channelId } }) => {
                if (!this.state.allChannels[channelId].newMessages && channelId !== this.nowChannelId) {
                    console.log('Updating for newMessage', channelId);

                    const { allChannels } = this.allStorage(['allChannels']);
                    const viewChannels = this.state.viewChannels.slice();

                    const allChannel = allChannels[channelId];
                    const viewChannel = this.getDataEdit(viewChannels, channelId);

                    if (!viewChannel) return;

                    allChannel.newMessages = true;
                    viewChannel.newMessages = true;

                    this.setState({ allChannels, viewChannels });
                }
            },
            onRolesCheckboxClick: (checked) => {
                const { allUsers } = this.allStorage(['allUsers']);

                const allUser = allUsers[this.nowUserId];

                allUser.editRoleUsers = checked;

                this.setupView(this.props, { allUsers });
            },
        };
    };

    parseViewChannels = (allChannels, checkUserRoles, isOwner) => {
        const viewChannels = [];

        Object.values(allChannels).forEach((channel) => {
            if (!channel.locked || isOwner || channel.roles.some(id => checkUserRoles[id])) {
                viewChannels.push(Object.assign({}, channel));
            }
        });

        return sortChannels(viewChannels);
    };

    parseViewUsers = (allUsers, requiredRoles, isPrivate) => {
        const viewUsers = [];

        const checkRequiredRoles = toObj(requiredRoles);

        Object.values(allUsers).forEach((user) => {
            if (!isPrivate || user.owner || user.roles.some(roleId => checkRequiredRoles[roleId])) {
                viewUsers.push(Object.assign({}, user));
            }
        });

        return viewUsers;
    };

    parseViewRoles = (allRoles, viewUsers, editRoleUsers) => {
        const viewRoles = [];
        const viewRolesMap = {};

        if (!editRoleUsers) {
            for (let i = 0; i < viewUsers.length; i++) {
                const user = viewUsers[i];
                const { id: userId, highestViewRoleId } = user;

                let role = viewRoles[viewRolesMap[highestViewRoleId]];

                if (!role) {
                    role = Object.assign({}, allRoles[highestViewRoleId], { members: [] });
                    viewRolesMap[highestViewRoleId] = viewRoles.push(role) - 1;
                }

                role.members.push(userId);
            }
        } else {
            Object.values(allRoles).forEach((role) => {
                role = Object.assign({}, role);
                role.members = role.members.filter(mId => findIndex(viewUsers, ['id', mId]) !== -1);
                viewRoles.push(role);
            });
        }

        for (let i = 0; i < viewRoles.length; i++) {
            const role = viewRoles[i];

            role.title = `${role.name}—${role.members.length}`;
        }

        sortRoles(viewRoles);

        return viewRoles;
    };

    setupView = (props, allStorage = {}) => {
        const {
            match: {
                params: { channelId: channelIdPassed },
            },
        } = props;

        const { allChannels = this.state.allChannels, allRoles = this.state.allRoles, allUsers = this.state.allUsers } = allStorage;

        // /////////////////////////////////////////////// PARSE CHANNEL-VIEW DATA //////////////////////////////////////////////////////////////////

        const nowUser = allUsers[this.nowUserId];
        const userRolesMap = toObj(nowUser.roles);
        nowUser.permissions = toObj(flatten(nowUser.roles.map(roleId => allRoles[roleId].permissions)));
        if (nowUser.owner) nowUser.permissions.OWNER = true;

        // Channels the current user can access
        const viewChannels = this.parseViewChannels(allChannels, userRolesMap, nowUser.owner);

        // Current channel
        const nowChannel = this.getNowChannel(channelIdPassed, viewChannels);

        this.noChannel = nowChannel == null;
        if (this.noChannel) {
            this.hasView = true;
            return;
        }

        nowChannel.canSend = nowChannel.defaultSend || nowUser.owner || nowChannel.sendRoles.some(r => userRolesMap[r]);

        nowChannel.newMessages = false;
        allChannels[nowChannel.id].newMessages = false;

        console.log(`=== ${nowChannel.name} (${nowChannel.id}) ===`);
        console.log('Rendering ViewChatWrapper');

        // Members who can view the current channel
        const viewUsers = this.parseViewUsers(allUsers, nowChannel.roles, nowChannel.locked);

        // Roles seen in the current channel
        const viewRoles = this.parseViewRoles(allRoles, viewUsers, nowUser.editRoleUsers);

        this.nowChannelId = nowChannel.id;
        this.hasView = true;

        this.setState({
            allChannels,
            allRoles,
            allUsers,
            viewChannels,
            viewRoles,
            viewUsers,
        });
    };

    render() {
        if (!this.hasView) {
            console.log('Loading ViewChatWrapper...');
            return null;
        }

        if (this.noChannel) {
            console.log('Major issue! The chat has no channels, you need to create some first!');
            return <p>Major issue! The chat has no channels, you need to create some first!</p>;
        }

        if (this.getNowChannel(this.props.match.params.channelId, this.state.viewChannels).id !== this.nowChannelId) {
            console.log('Waiting for new view-data computation...');
            return null;
        }

        const { nowUserId, nowChannelId, pushUpMethods, chatId } = this;
        const {
            allChannels, allRoles, allUsers, viewChannels, viewRoles, viewUsers, selfMessage,
        } = this.state;

        const nowUser = find(this.state.viewUsers, ['id', nowUserId]);
        const nowChannel = find(this.state.viewChannels, ['id', nowChannelId]);

        // const nowChannel = allChannels[nowChannelId];

        console.log('Channel view data:', {
            allChannels,
            allRoles,
            allUsers,
            viewChannels,
            viewRoles,
            viewUsers,
            nowUser,
            nowChannel,
        });

        return (
            <pushUpContext.Provider value={pushUpMethods}>
                <nowUserContext.Provider value={nowUser}>
                    <nowChannelContext.Provider value={nowChannel}>
                        <allChannelsContext.Provider value={allChannels}>
                            <allRolesContext.Provider value={allRoles}>
                                <allUsersContext.Provider value={allUsers}>
                                    <viewChannelsContext.Provider value={viewChannels}>
                                        <viewRolesContext.Provider value={viewRoles}>
                                            <viewUsersContext.Provider value={viewUsers}>
                                                <selfMessageContext.Provider value={selfMessage}>
                                                    <ViewChat
                                                        channelId={nowChannel.id}
                                                        userId={nowUser.id}
                                                        username={nowUser.username}
                                                        channelName={nowChannel.name}
                                                        chatId={chatId}
                                                    />
                                                </selfMessageContext.Provider>
                                            </viewUsersContext.Provider>
                                        </viewRolesContext.Provider>
                                    </viewChannelsContext.Provider>
                                </allUsersContext.Provider>
                            </allRolesContext.Provider>
                        </allChannelsContext.Provider>
                    </nowChannelContext.Provider>
                </nowUserContext.Provider>
            </pushUpContext.Provider>
        );
    }
}

export default withApollo(ViewChatWrapper);

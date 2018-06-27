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
} from '../context/dataContexts';

const sortRoles = roles => roles.sort((a, b) => (a.id === 1 ? 1 : (b.position || 0) - (a.position || 0)));
const sortChannels = channels => channels.sort((a, b) => a.id - b.id);

const toObj = arr =>
    arr.reduce((o, val) => {
        o[val] = true;
        return o;
    }, {});

class ViewChatWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewChannels: [],
            viewRoles: [],
            viewUsers: [],
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

    mapArrToObj = (allData, dataProps) => {
        // GraphQL data is read-only
        allData = allData.slice();
        const { fixDataProps } = this;

        // Change from array of objects to an array
        for (let i = 0; i < allData.length; i++) {
            allData[i] = fixDataProps(allData[i], dataProps);
        }

        // Change from Array to Object
        return keyBy(allData, 'id');
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

            const highestRoleId = Math.max(...userRoles);
            const highestViewRoleId = Math.max(...userRoles.filter(id => allRoles[id].view));
            const highestViewRole = allRoles[highestViewRoleId];

            user.roles = userRoles;
            user.highestRoleId = highestRoleId;
            user.highestViewRoleId = highestViewRoleId;
            user.color = highestViewRole.color;
        });
    };

    setupData = (chatData) => {
        const { id: nowUserId, allChannels: allChannelsOrig, allRoles: allRolesOrig, allUsers: allUsersOrig } = chatData;

        // /////////////////////////////////////////////// PARSE GRAPHQL DATA //////////////////////////////////////////////////////////////////

        // GraphQL data is read-only
        const allRoles = this.mapArrToObj(allRolesOrig, [
            { propName: 'members', valueKey: 'id' },
            { propName: 'permissions', valueKey: 'name' },
        ]);
        const allChannels = this.mapArrToObj(allChannelsOrig, [{ propName: 'roles', valueKey: 'id' }]);
        const allUsers = this.mapArrToObj(allUsersOrig);

        this.linkRoles(allUsers, allRoles);

        this.setupPushUps();

        console.log('Setup data:', {
            allRoles,
            allChannels,
            allUsers,
        });

        this.allRoles = allRoles;
        this.allChannels = allChannels;
        this.allUsers = allUsers;

        this.nowUserId = nowUserId;

        this.hasData = true;

        this.setupView(this.props);
    };

    setupPushUps = () => {
        this.pushUpMethods = {
            newChannel: (newChannelData) => {
                console.log('Updating for newChannel');

                this.allChannels[newChannelData.id] = this.fixDataProps(newChannelData, [{ propName: 'roles', valueKey: 'id' }]);

                this.setupView(this.props);
            },
            newRoleUser: ({ role: { id: roleId }, user: { id: userId } }) => {
                console.log('Updating for newRoleUser');
                // setTimeout(() => {
                const role = this.allRoles[roleId];
                const user = this.allUsers[userId];

                if (!role || !user) {
                    console.log('newRoleUser error', '| role:', role, '| user:', user);
                }

                if (!role.members.includes(userId)) role.members.push(userId);
                if (!user.roles.includes(roleId)) user.roles.push(roleId);

                const highestRoleId = Math.max(...user.roles);
                const highestViewRoleId = Math.max(...user.roles.filter(id => this.allRoles[id].view));
                const highestViewRole = this.allRoles[highestViewRoleId];

                user.highestRoleId = highestRoleId;
                user.highestViewRoleId = highestViewRoleId;
                user.color = highestViewRole.color;

                // if (userId === this.nowUserId) {
                // console.log('User was client, refreshing view');
                this.setupView(this.props);
                // } else {
                //     const viewUsers = this.state.viewUsers.slice();
                //     const nowChannel = find(this.state.viewChannels, ['id', this.nowChannelId]);

                //     // ////////////////////////////////////////////////////
                //     const viewUserIndex = findIndex(viewUsers, ['id', user.id]);

                //     if (role.owner) user.owner = true;
                //     const checkRequiredRoles = toObj(nowChannel.roles);

                //     if (viewUserIndex > -1) {
                //         viewUsers[viewUserIndex] = Object.assign({}, user);
                //     } else if (!nowChannel.locked || user.owner || user.roles.some(rId => checkRequiredRoles[rId])) {
                //         // Check if viewUsers changed
                //         viewUsers.push(Object.assign({}, user));
                //     }

                //     const highestRoleId = Math.max(...user.roles);
                //     const highestViewRoleId = Math.max(...user.roles.filter(id => this.allRoles[id].view));
                //     const highestViewRole = this.allRoles[highestViewRoleId];

                //     user.highestRoleId = highestRoleId;
                //     user.highestViewRoleId = highestViewRoleId;
                //     user.color = highestViewRole.color;
                //     // ////////////////////////////////////////////////////

                //     this.setState({ viewUsers });
                // }
                // }, 4000);
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

    parseViewRoles = (allRoles, viewUsers) => {
        const viewRoles = [];
        const viewRolesMap = {};

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

        for (let i = 0; i < viewRoles.length; i++) {
            const role = viewRoles[i];

            role.title = `${role.name}—${role.members.length}`;
        }

        return sortRoles(viewRoles);
    };

    setupView = (props) => {
        const {
            match: {
                params: { channelId: channelIdPassed },
            },
        } = props;

        const { allChannels, allRoles, allUsers } = this;

        // /////////////////////////////////////////////// PARSE CHANNEL-VIEW DATA //////////////////////////////////////////////////////////////////

        const nowUser = allUsers[this.nowUserId];
        const userRolesMap = toObj(nowUser.roles);

        // Channels the current user can access
        const viewChannels = this.parseViewChannels(allChannels, userRolesMap, nowUser.owner);

        // Current channel
        const nowChannel = this.getNowChannel(channelIdPassed, viewChannels);

        if (nowChannel == null) {
            this.hasView = true;
            this.noChannel = true;
            return;
        }

        this.noChannel = false;

        console.log(`=== ${nowChannel.name} (${nowChannel.id}) ===`);
        console.log('Rendering ViewChatWrapper');

        // Members who can view the current channel
        const viewUsers = this.parseViewUsers(allUsers, nowChannel.roles, nowChannel.locked);

        // Roles seen in the current channel
        const viewRoles = this.parseViewRoles(allRoles, viewUsers);

        this.nowChannelId = nowChannel.id;
        this.hasView = true;

        this.setState({ viewChannels, viewRoles, viewUsers });
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

        const {
            allChannels, allRoles, allUsers, nowUserId, nowChannelId, pushUpMethods,
        } = this;
        const { viewChannels, viewRoles, viewUsers } = this.state;

        const nowUser = allUsers[nowUserId];
        nowUser.permissions = toObj(flatten(nowUser.roles.map(roleId => allRoles[roleId].permissions)));

        const nowChannel = find(this.state.viewChannels, ['id', nowChannelId]);

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
                                                <ViewChat
                                                    channelId={nowChannel.id}
                                                    username={nowUser.username}
                                                    channelName={nowChannel.name}
                                                />
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

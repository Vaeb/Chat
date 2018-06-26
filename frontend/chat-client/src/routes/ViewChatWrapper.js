import React from 'react';
import { withApollo } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
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

        const {
            setupData,
            props: { history },
        } = this;

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

    setupData = (chatData) => {
        const { id: userId, allChannels: allChannelsOrig, allRoles: allRolesOrig, allUsers: allUsersOrig } = chatData;

        // /////////////////////////////////////////////// PARSE GRAPHQL DATA //////////////////////////////////////////////////////////////////

        // GraphQL data is read-only
        const allRoles = this.mapArrToObj(allRolesOrig, [
            { propName: 'members', valueKey: 'id' },
            { propName: 'permissions', valueKey: 'name' },
        ]);
        const allChannels = this.mapArrToObj(allChannelsOrig, [{ propName: 'roles', valueKey: 'id' }]);
        const allUsers = this.mapArrToObj(allUsersOrig);

        this.linkRoles(allUsers, allRoles);

        const nowUser = allUsers[userId];
        nowUser.permissions = toObj(flatten(nowUser.roles.map(roleId => allRoles[roleId].permissions)));

        const checkUserRoles = toObj(nowUser.roles);
        const viewChannels = this.parseViewChannels(allChannels, checkUserRoles, nowUser.owner);

        console.log('Setup data:', {
            allRoles,
            allChannels,
            allUsers,
            nowUser,
            viewChannels,
        });

        this.allRoles = allRoles;
        this.allChannels = allChannels;
        this.allUsers = allUsers;

        this.viewChannels = viewChannels;

        this.nowUser = nowUser;
        this.setup = true;
        this.forceUpdate();
    };

    mapArrToObj = (allData, dataProps = []) => {
        // GraphQL data is read-only
        allData = allData.slice();

        // Change list in data from Array to Object: role.members = { 13: [id: 13, name: 'Bob'] }
        /* for (let i = 0; i < allData.length; i++) {
            const newData = Object.assign({}, allData[i]);

            if (dataProp) {
                const newDataArr = newData[dataProp];
                const newDataObj = {};

                for (let j = 0; j < newDataArr.length; j++) {
                    newDataObj[newDataArr[j].id] = true;
                }

                newData[dataProp] = newDataObj;
            }

            allData[i] = newData;
        } */

        // Change from array of objects to an array
        for (let i = 0; i < allData.length; i++) {
            const newData = Object.assign({}, allData[i]);

            if (dataProps.length > 0) {
                for (let j = 0; j < dataProps.length; j++) {
                    const { propName, valueKey } = dataProps[j];
                    newData[propName] = map(newData[propName], valueKey);
                }
            }

            allData[i] = newData;
        }

        // Change from Array to Object
        return keyBy(allData, 'id');
    };

    parseViewChannels = (allChannels, checkUserRoles, isOwner) => {
        const viewChannels = [];

        Object.values(allChannels).forEach((channel) => {
            if (!channel.locked || isOwner || channel.roles.some(roleData => checkUserRoles[roleData.id])) {
                viewChannels.push(channel);
            }
        });

        return sortChannels(viewChannels);
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
            const viewRole = allRoles[highestViewRoleId];

            user.roles = userRoles;
            user.highestRoleId = highestRoleId;
            user.highestViewRoleId = highestViewRoleId;
            user.color = viewRole.color;
        });
    };

    parseViewUsers = (allUsers, requiredRoles, isPrivate) => {
        const viewUsers = [];

        const checkRequiredRoles = toObj(requiredRoles);

        Object.values(allUsers).forEach((user) => {
            if (!isPrivate || user.owner || user.roles.some(roleId => checkRequiredRoles[roleId])) {
                viewUsers.push(user);
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

    render() {
        if (!this.setup) {
            console.log('Loading ViewChatWrapper...');
            return null;
        }

        console.log('Rendering ViewChatWrapper');

        const {
            match: {
                params: { channelId: channelIdPassed },
            },
        } = this.props;

        const {
            allRoles, allChannels, allUsers, viewChannels, nowUser,
        } = this;

        // /////////////////////////////////////////////// PARSE CHANNEL-VIEW DATA //////////////////////////////////////////////////////////////////

        // Current channel id
        let channelId = parseInt(channelIdPassed, 10);

        // Current channel
        const nowChannel = viewChannels[Math.max(channelId ? findIndex(viewChannels, ['id', channelId]) : 0, 0)];

        if (nowChannel == null) {
            console.log('Major issue! The chat has no channels, you need to create some first!');
            return <p>Major issue! The chat has no channels, you need to create some first!</p>;
        }

        // In case it doesn't exist
        channelId = nowChannel.id;

        const isPrivate = nowChannel.locked;

        console.log(`=== ${nowChannel.name} (${channelId}) ===`);

        // Members who can view the current channel
        const viewUsers = this.parseViewUsers(allUsers, nowChannel.roles, isPrivate);

        // Roles seen in the current channel
        const viewRoles = this.parseViewRoles(allRoles, viewUsers);

        console.log('Channel view data:', {
            nowChannel,
            viewUsers,
            viewRoles,
        });

        return (
            <nowUserContext.Provider value={nowUser}>
                <nowChannelContext.Provider value={nowChannel}>
                    <allRolesContext.Provider value={allRoles}>
                        <allChannelsContext.Provider value={allChannels}>
                            <allUsersContext.Provider value={allUsers}>
                                <viewRolesContext.Provider value={viewRoles}>
                                    <viewChannelsContext.Provider value={viewChannels}>
                                        <viewUsersContext.Provider value={viewUsers}>
                                            <ViewChat channelId={channelId} username={nowUser.name} channelName={nowChannel.name} />
                                        </viewUsersContext.Provider>
                                    </viewChannelsContext.Provider>
                                </viewRolesContext.Provider>
                            </allUsersContext.Provider>
                        </allChannelsContext.Provider>
                    </allRolesContext.Provider>
                </nowChannelContext.Provider>
            </nowUserContext.Provider>
        );
    }
}

export default withApollo(ViewChatWrapper);

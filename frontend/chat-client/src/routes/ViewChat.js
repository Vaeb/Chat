import React from 'react';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import uniqBy from 'lodash/uniqBy';
import flatten from 'lodash/flatten';
import concat from 'lodash/concat';
import keyBy from 'lodash/keyBy';

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import SideBars from '../containers/SideBars';

import { viewQuery } from '../graphql/chat';

const sortRoles = roles => roles.sort((a, b) => (a.id === 1 ? 1 : (b.position || 0) - (a.position || 0)));
const sortChannels = channels => channels.sort((a, b) => a.id - b.id);

// prettier-ignore
const ViewChat = ({ data: { loading, chatData }, match: { params: { channelId } } }) => {
    if (loading) return null;
    if (!chatData) {
        console.log('Chat data not found, are you logged in?');
        return <Redirect to="/login" />;
    }

    // Current channel id
    channelId = parseInt(channelId, 10);

    // Data from GraphQL
    const {
        username, roles: userRolesOrig, openChannels, allRoles: allRolesOrigPre, allUsers: allUsersOrig,
    } = chatData;

    // GraphQL data is read-only
    const allRolesOrig = allRolesOrigPre.slice();

    // Change role.members from Object to Array
    for (let i = 0; i < allRolesOrig.length; i++) {
        allRolesOrig[i] = Object.assign({}, allRolesOrig[i]);
        allRolesOrig[i].members = map(allRolesOrig[i].members, 'id');
    }

    // Change from Array to Object
    const allUsers = keyBy(allUsersOrig, 'id');
    const allRoles = keyBy(allRolesOrig, 'id');

    // Public channels + Private channels accessible with the current user's roles
    const accessChannels = flatten(map(userRolesOrig, 'channels'));
    const viewChannels = sortChannels(uniqBy(concat(accessChannels, openChannels), 'id')).map(channel => Object.assign({}, channel));

    // Current channel
    const nowChannelIndex = Math.max(channelId ? findIndex(viewChannels, ['id', channelId]) : 0, 0);
    const nowChannel = viewChannels[nowChannelIndex];

    if (nowChannel == null) {
        console.log('Major issue! The chat has no channels, you need to create some first!');
        return (<p>Major issue! The chat has no channels, you need to create some first!</p>);
    }

    // In case it doesn't exist
    channelId = nowChannel.id;

    console.log(`=== ${nowChannel.name} (${channelId}) ===`);

    // Set as property
    nowChannel.current = true;

    // Current channel private
    const isPrivate = nowChannel.locked;

    // Roles required to access current channel (only relevant if private)
    const requiredRoles = map(nowChannel.roles, 'id');

    // Members who can view the current channel
    const viewMembers = [];

    // Build viewMembers and find all member roles in the process
    for (let i = 0; i < allUsersOrig.length; i++) {
        const { id: checkUserId } = allUsersOrig[i];

        const memberRoles = [];
        let hasAccess = !isPrivate;

        for (let j = 0; j < allRolesOrig.length; j++) {
            const origRole = allRolesOrig[j];

            if (origRole.members.includes(checkUserId)) {
                memberRoles.push(origRole.id);

                if (requiredRoles.includes(origRole.id)) hasAccess = true;
            }
        }

        if (hasAccess) {
            const member = Object.assign({ roles: memberRoles }, allUsers[checkUserId]);
            viewMembers.push(member);
        }
    }

    // Roles seen in the current channel
    const viewRoles = [];
    const viewRolesMap = {};

    // Build viewRoles, get each member's highest visible role and add color property to members (from visible role)
    for (let i = 0; i < viewMembers.length; i++) {
        const member = viewMembers[i];

        const viewRoleId = Math.max(...member.roles.filter(id => allRoles[id].view));

        member.viewRoleId = viewRoleId;

        let role = viewRoles[viewRolesMap[viewRoleId]];

        if (!role) {
            role = Object.assign({}, allRoles[viewRoleId]);
            role.members = [];
            viewRolesMap[viewRoleId] = viewRoles.push(role) - 1;
        }

        member.color = role.color;

        role.members.push({ id: member.id, username: member.username, color: member.color, viewRoleId: member.viewRoleId });
    }

    // Once viewRoles is built, set the role title to include the number of members
    for (let i = 0; i < viewRoles.length; i++) {
        const role = viewRoles[i];

        role.title = `${role.name}—${role.members.length}`;
    }

    // Sort roles by position
    sortRoles(viewRoles);

    console.log('nowChannel:', nowChannel);
    console.log('viewChannels:', viewChannels);
    // console.log('allRoles:', allRoles);
    console.log('requiredRoles:', requiredRoles);
    console.log('viewRoles:', viewRoles);
    // console.log('allUsers:', allUsers);
    console.log('viewMembers:', viewMembers);

    return (
        <AppLayout>
            <SideBars username={username} currentChannelId={channelId} viewRoles={viewRoles} userChannels={viewChannels} />
            <Header channelName={nowChannel.name} />
            <Messages channelId={channelId}>
                <ul className="message-list">
                    <li />
                    <li />
                </ul>
            </Messages>
            <SendMessage channelName={nowChannel.name} />
        </AppLayout>
    );
};

export default graphql(viewQuery, { options: { fetchPolicy: 'network-only' } })(ViewChat);

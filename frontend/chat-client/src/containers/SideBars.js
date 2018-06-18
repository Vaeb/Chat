import React from 'react';

import Channels from '../components/Channels';
import Roles from '../components/Roles';

/*

    -Channel should have a private attribute
        -If channel is private, only connected Roles can view it
        -If channel is not private, connected Roles are ignored

*/

// eslint-disable-next-line arrow-body-style
const SideBars = ({ username, currentChannelId, viewRoles, userChannels }) => {
    // prettier-ignore
    /* const viewChannels = allChannels.filter(({ roles, locked }) =>
        !locked || map(roles, 'id').some(roleId => userRoles.includes(roleId)));

    const channelArr = viewChannels.map(({ id, name }) => ({ id, name }));

    let roleArr = viewChannels.map(({ roles }) =>
        roles.filter(({ view }) => view).map(({
            id, name, position, view, members,
        }) => ({
            id,
            name,
            position,
            view,
            members,
        })));

    roleArr = sortRoles(uniqBy(flatten(roleArr), 'id')); */

    return (
        <React.Fragment>
            {/* <Roles roles={[{ id: 1, name: 'Staff' }, { id: 2, name: 'User' }]} /> */}
            <Roles roles={viewRoles} />
            <Channels
                chatName="Vashta"
                username={username}
                currentChannelId={currentChannelId}
                channels={userChannels}
            />
        </React.Fragment>
    );
};

export default SideBars;

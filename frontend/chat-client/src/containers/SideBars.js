import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';

import Channels from '../components/Channels';
import Roles from '../components/Roles';

/*

    -Public channels: If a channel just has the `Everyone` role then display all roles because all users will be able to view that channel
    -Private channels: If a channel has more than one role (has a role other than `Everyone`) then only display those roles that have access

*/

const sortRoles = roles => roles.sort((a, b) => (a.name == 'everyone' ? 1 : b.position - a.position));

const SideBars = ({ data: { loading, allChannels }, currentChannelId }) => {
    if (loading) return null;

    const channelArr = allChannels.map(({ id, name }) => ({ id, name }));
    const currentChannel = allChannels.find(({ id }) => id == currentChannelId);

    let roleArr = currentChannel.roles.map(({ id, name, position }) => ({ id, name, position }));

    if (roleArr.length > 1) {
        // Private channel
        roleArr = currentChannel.map(({ roles }) => roles.map(({ id, name, position }) => ({ id, name, position })));
    } else {
        // Public channel
        roleArr = allChannels.map(({ roles }) => roles.map(({ id, name, position }) => ({ id, name, position })));
        roleArr = sortRoles(_.uniqBy(_.flatten(roleArr), 'id'));
    }

    roleArr = sortRoles(roleArr);

    console.log(roleArr);

    return (
        <React.Fragment>
            {/* <Roles roles={[{ id: 1, name: 'Staff' }, { id: 2, name: 'User' }]} /> */}
            <Roles roles={roleArr} />
            <Channels
                chatName="Vashta"
                username="Vaeb"
                currentChannelId={currentChannelId}
                // channels={[{ id: 1, name: 'general' }, { id: 2, name: 'staff' }]}
                channels={channelArr}
                // users={[{ id: 1, name: 'vaeb' }, { id: 2, name: 'user1' }]}
            />
        </React.Fragment>
    );
};

/*
{
  allRoles {
    id
    name
    color
    position
    permissions {
      name
    }
    members {
      id
      username
    }
    channels {
      id
      name
    }
  }
}
*/

const allChannelsQuery = gql`
    {
        allChannels {
            id
            name
            roles {
                id
                name
                color
                position
                members {
                    id
                    username
                }
            }
        }
    }
`;

export default graphql(allChannelsQuery)(SideBars);

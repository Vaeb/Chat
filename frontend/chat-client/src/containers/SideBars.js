import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import _ from 'lodash';
import decode from 'jwt-decode';

import Channels from '../components/Channels';
import Roles from '../components/Roles';

/*

    -Channel should have a private attribute
        -If channel is private, only connected Roles can view it
        -If channel is not private, connected Roles are ignored

*/

const sortRoles = roles => roles.sort((a, b) => (a.id == 1 ? 1 : b.position - a.position));

const SideBars = ({ data: { loading, allChannels }, currentChannelId }) => {
    if (loading) return null;

    const channelIdx = _.findIndex(allChannels, ['id', currentChannelId]);

    if (channelIdx == -1) {
        console.log('Current channel not found');
        return null;
    }

    const channel = allChannels[channelIdx];

    let username = '';

    try {
        const token = localStorage.getItem('token');
        const { user } = decode(token);
        ({ username } = user);
    } catch (err) {
        console.log('ERROR:', err);
    }

    const channelArr = allChannels.map(({ id, name }) => ({ id, name }));

    let roleArr = allChannels.map(({ roles }) =>
        roles.filter(({ view }) => view).map(({
            id, name, position, view, members,
        }) => ({
            id,
            name,
            position,
            view,
            members,
        })));

    roleArr = sortRoles(_.uniqBy(_.flatten(roleArr), 'id'));

    console.log(roleArr);

    return (
        <React.Fragment>
            {/* <Roles roles={[{ id: 1, name: 'Staff' }, { id: 2, name: 'User' }]} /> */}
            <Roles roles={roleArr} />
            <Channels
                chatName="Vashta"
                username={username}
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
    view
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
                view
                members {
                    id
                    username
                }
            }
        }
    }
`;

export default graphql(allChannelsQuery)(SideBars);

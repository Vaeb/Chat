import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import Channels from '../components/Channels';
import Roles from '../components/Roles';

const SideBars = ({ data: { loading, allTeams } }) =>
    (loading ? null : (
        <React.Fragment>
            <Roles roles={[{ id: 1, name: 'Staff' }, { id: 2, name: 'User' }]} />
            <Channels
                chatName="Vashta"
                username="Vaeb"
                channels={[{ id: 1, name: 'general' }, { id: 2, name: 'staff' }]}
                // users={[{ id: 1, name: 'vaeb' }, { id: 2, name: 'user1' }]}
            />
        </React.Fragment>
    ));

const allRolesQuery = gql`
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
`;

export default graphql(allRolesQuery)(SideBars);

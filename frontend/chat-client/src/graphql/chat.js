import gql from 'graphql-tag';

/*

    -Channels: All unlocked channels + accessible locked channels (where the user's roles cross-over with channel's roles)
    -Members: All unlocked channels members + accessible locked channels members
    -Roles: All roles

    -openChannels: All unlocked channel data + access roles
    -allRoles: All role data + member ids
    -allUsers: All member data
    -roles: All user roles + access channel data

    --------------

    -create Channels:
        -merge: openChannels data + roles.channels data
    -create AccessRoles:
        -merge: roles id
    -create Members:
        -For each role[i] in allRoles
            -If role[i] in AccessRoles
                -For each member[i] in role[i].members
                    -If not Members[member[i]] exists
                        -Members <- allUsers[member[i]] using member[i].id
                    -Members[member[i]].roles <- role[i].id
    -create ViewRoles:
        -For each Member[i] in Members
            -Member[i].highestRoleView = find-highest-view-role from Member[i].roles using allRoles
            -ViewRoles[Member[i].highestRoleView] <- Member[i].id

*/

// eslint-disable-next-line import/prefer-default-export
export const viewQuery = gql`
    {
        chatData {
            id
            username
            openChannels {
                id
                name
                locked
                roles {
                    id
                }
            }
            allRoles {
                id
                name
                color
                position
                view
                members {
                    id
                }
            }
            allUsers {
                id
                username
            }
            roles {
                id
                permissions {
                    name
                }
                channels {
                    id
                    name
                    locked
                    roles {
                        id
                    }
                }
            }
        }
    }
`;

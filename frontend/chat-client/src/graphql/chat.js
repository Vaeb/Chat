import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const viewQuery = gql`
    {
        chatData {
            id
            username
            allChannels {
                id
                name
                locked
                default_send
                channelRoles {
                    roleId
                    send
                }
            }
            allRoles {
                id
                name
                color
                position
                view
                owner
                members {
                    id
                }
                permissions {
                    name
                }
            }
            allUsers {
                id
                username
            }
        }
    }
`;

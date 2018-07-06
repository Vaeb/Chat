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
                vashtaId
                vashtaUsername
            }
        }
    }
`;

export const newChannel = gql`
    subscription {
        newChannel {
            id
            name
            locked
            roles {
                id
            }
        }
    }
`;

export const newRole = gql`
    subscription {
        newRole {
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
    }
`;

export const newRoleUser = gql`
    subscription {
        newRoleUser {
            role {
                id
            }
            user {
                id
            }
        }
    }
`;

export const remRoleUser = gql`
    subscription {
        remRoleUser {
            role {
                id
            }
            user {
                id
            }
        }
    }
`;

export const newUser = gql`
    subscription {
        newUser {
            id
            username
            vashtaId
            vashtaUsername
            roles {
                id
            }
        }
    }
`;

export const changeUser = gql`
    subscription {
        changeUser {
            id
            username
            vashtaId
            vashtaUsername
        }
    }
`;

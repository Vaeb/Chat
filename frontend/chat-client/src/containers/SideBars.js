import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import Channels from '../components/Channels';
import Roles from '../components/Roles';
import AddChannelModal from '../components/AddChannelModal';
import AddUserToRoleModal from '../components/AddUserToRoleModal';
import AddRoleModal from '../components/AddRoleModal';
import { withData } from '../context/dataContexts';

const subscriptions = {
    newChannel: gql`
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
    `,
    newRole: gql`
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
    `,
    newRoleUser: gql`
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
    `,
    remRoleUser: gql`
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
    `,
    newUser: gql`
        subscription {
            newUser {
                id
                username
                roles {
                    id
                }
            }
        }
    `,
};

const remUserFromRoleMutation = gql`
    mutation($userId: Int!, $roleId: Int!) {
        remUserFromRole(userId: $userId, roleId: $roleId) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

class SideBars extends React.Component {
    constructor(props) {
        super(props);

        this.defaultState = {
            addChannelModal: { open: false },
            addRoleModal: { open: false },
            addUserRoleModal: { open: false, roleId: null, roleName: null },
        };

        this.state = Object.assign({}, this.defaultState);
    }

    componentDidMount() {
        console.log('Setting up subscriptions');
        const pushUpMethods = this.props.chatData.pushUp;

        this.subEvents = [
            this.makeSubscription('New channel', 'newChannel', pushUpMethods),
            this.makeSubscription('New role', 'newRole', pushUpMethods),
            this.makeSubscription('New role user', 'newRoleUser', pushUpMethods),
            this.makeSubscription('Remove role user', 'remRoleUser', pushUpMethods),
            this.makeSubscription('New user', 'newUser', pushUpMethods),
        ];
    }

    componentWillUnmount() {
        this.subEvents.forEach(subEvent => subEvent.unsubscribe());
        this.subEvents = [];
    }

    makeSubscription = (subName, dataName, pushUpMethods) =>
        this.props.client
            .subscribe({
                query: subscriptions[dataName],
            })
            .subscribe({
                next(eventData) {
                    if (eventData.errors || !eventData.data) {
                        console.log(`${subName} subscription data error:`, eventData.errors);
                        return;
                    }

                    const newData = eventData.data[dataName];

                    pushUpMethods[dataName](newData);
                },
                error(err) {
                    console.error(`${subName} error:`, err);
                },
            });

    toggleAddChannelModal = ({ e, resetForm } = {}) => {
        if (e) e.preventDefault();

        this.setState((state) => {
            // Do open
            if (!state.addChannelModal.open) return { addChannelModal: { open: true } };

            // Do close
            resetForm();
            return { addChannelModal: this.defaultState.addChannelModal };
        });
    };

    toggleAddRoleModal = ({ e, resetForm } = {}) => {
        if (e) e.preventDefault();

        this.setState((state) => {
            // Do open
            if (!state.addRoleModal.open) return { addRoleModal: { open: true } };

            // Do close
            resetForm();
            return { addRoleModal: this.defaultState.addRoleModal };
        });
    };

    toggleAddUserRoleModal = ({ e, roleId, roleName, resetForm } = {}) => {
        if (e) e.preventDefault();

        console.log(this.defaultState.addUserRoleModal);

        this.setState((state) => {
            // Do open
            if (!state.addUserRoleModal.open) return { addUserRoleModal: { open: true, roleId, roleName } };

            // Do close
            resetForm();
            console.log(this.defaultState.addUserRoleModal);
            return { addUserRoleModal: this.defaultState.addUserRoleModal };
        });
    };

    removeUserRole = ({ userId, roleId } = {}) => {
        this.props.client
            .mutate({
                mutation: remUserFromRoleMutation,
                variables: { userId, roleId },
            })
            .catch((err) => {
                console.log('RemoveUserRole error:', err);
            });
    };

    onRolesCheckboxClick = (checked) => {
        console.log('toggled', checked);
        this.setState(state => ({ editRoleUsers: !state.editRoleUsers }));
    };

    render() {
        const {
            username,
            channelId,
            isSmall,
            chatData: { nowUser, pushUp },
        } = this.props;

        const { addChannelModal, addRoleModal, addUserRoleModal } = this.state;

        console.log('Rendering SideBars');

        const canAdd = nowUser.permissions.ADD_ROLE || nowUser.permissions.OWNER;
        const canCreate = nowUser.permissions.OWNER;

        return (
            <React.Fragment>
                {!isSmall ? (
                    <Roles
                        canAdd={canAdd}
                        editRoleUsers={nowUser.editRoleUsers}
                        onRoleClick={this.toggleAddUserRoleModal}
                        onEditClick={pushUp.onRolesCheckboxClick}
                        onUserRoleClick={this.removeUserRole}
                    />
                ) : null}
                <Channels
                    chatName="Vashta"
                    username={username}
                    currentChannelId={channelId}
                    onAddChannelClick={this.toggleAddChannelModal}
                    onAddRoleClick={this.toggleAddRoleModal}
                    canCreate={canCreate}
                />
                <AddChannelModal key="add-channel-modal" onClose={this.toggleAddChannelModal} open={addChannelModal.open} />
                <AddRoleModal key="add-role-modal" onClose={this.toggleAddRoleModal} open={addRoleModal.open} />
                <AddUserToRoleModal
                    key="add-user-to-role-modal"
                    onClose={this.toggleAddUserRoleModal}
                    open={addUserRoleModal.open}
                    roleId={addUserRoleModal.roleId}
                    roleName={addUserRoleModal.roleName}
                />
            </React.Fragment>
        );
    }
}

export default withApollo(withData(SideBars, ['nowUser', 'pushUp']));

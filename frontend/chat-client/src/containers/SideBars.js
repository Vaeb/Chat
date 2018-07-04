import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import Channels from '../components/Channels';
import Roles from '../components/Roles';
import AddChannelModal from '../components/modals/AddChannelModal';
import AddUserToRoleModal from '../components/modals/AddUserToRoleModal';
import AddRoleModal from '../components/modals/AddRoleModal';
import LinkVashtaModal from '../components/modals/LinkVashtaModal';
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
            linkVashtaModal: { open: false },
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

    makeToggle = (stateProp, openStateOrig, args = []) => ({ e, resetForm, ...otherArgs } = {}) => {
        const openState = Object.assign({}, openStateOrig);

        args.forEach((argProp) => {
            if (otherArgs[argProp]) openState[argProp] = otherArgs[argProp];
        });

        if (e) e.preventDefault();
        if (resetForm) resetForm();

        this.setState((state) => {
            // Do open
            if (!state[stateProp].open) return { [stateProp]: openState };

            // Do close
            return { [stateProp]: this.defaultState[stateProp] };
        });
    };

    toggleAddChannelModal = this.makeToggle('addChannelModal', { open: true });
    toggleAddRoleModal = this.makeToggle('addRoleModal', { open: true });
    toggleAddUserRoleModal = this.makeToggle('addUserRoleModal', { open: true }, ['roleId', 'roleName']);
    toggleLinkVashtaModal = this.makeToggle('linkVashtaModal', { open: true });

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

    render() {
        const {
            username,
            channelId,
            isNarrow,
            chatData: { nowUser, pushUp },
        } = this.props;

        const { addChannelModal, addRoleModal, addUserRoleModal, linkVashtaModal } = this.state;

        console.log('Rendering SideBars');

        const canAdd = nowUser.permissions.ADD_ROLE || nowUser.permissions.OWNER;
        const canCreate = nowUser.permissions.OWNER;

        return (
            <React.Fragment>
                {!isNarrow ? (
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
                    onLinkVashtaClick={this.toggleLinkVashtaModal}
                    canCreate={canCreate}
                    isNarrow={isNarrow}
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
                <LinkVashtaModal key="link-vashta-modal" onClose={this.toggleLinkVashtaModal} open={linkVashtaModal.open} />
            </React.Fragment>
        );
    }
}

export default withApollo(withData(SideBars, ['nowUser', 'pushUp']));

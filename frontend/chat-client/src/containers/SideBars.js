import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import Channels from '../components/Channels';
import Roles from '../components/Roles';
import AddChannelModal from '../components/AddChannelModal';
import AddUserToRoleModal from '../components/AddUserToRoleModal';
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
                members {
                    id
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

class SideBars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addChannelModal: { open: false },
            addUserToRoleModal: { open: false, roleId: null, roleName: null },
        };
    }

    componentDidMount() {
        console.log('Setting up subscriptions');
        const pushUpMethods = this.props.chatData.pushUp;

        this.subEvents = [
            this.makeSubscription('New channel', 'newChannel', pushUpMethods),
            this.makeSubscription('New role user', 'newRoleUser', pushUpMethods),
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
            // Open
            if (!state.addChannelModal.open) {
                return { addChannelModal: { open: true } };
            }
            // Close
            resetForm();
            return { addChannelModal: { open: false } };
        });
    };

    toggleAddUserToRoleModal = ({ e, roleId, roleName, resetForm } = {}) => {
        if (e) e.preventDefault();

        this.setState((state) => {
            // Open
            if (!state.addUserToRoleModal.open) {
                return { addUserToRoleModal: { open: true, roleId, roleName } };
            }
            // Close
            resetForm();
            return { addUserToRoleModal: { open: false, roleId: null, roleName: null } };
        });
    };

    render() {
        const {
            username,
            channelId,
            chatData: { nowUser },
        } = this.props;
        const { addChannelModal, addUserToRoleModal } = this.state;

        console.log('Rendering SideBars');

        const canAdd = nowUser.permissions.ADD_ROLE || nowUser.permissions.OWNER;
        const canCreate = nowUser.permissions.OWNER;

        return (
            <React.Fragment>
                <Roles onRoleClick={this.toggleAddUserToRoleModal} canAdd={canAdd} />
                <Channels
                    chatName="Vashta"
                    username={username}
                    currentChannelId={channelId}
                    onAddChannelClick={this.toggleAddChannelModal}
                    canCreate={canCreate}
                />
                <AddChannelModal key="add-channel-modal" onClose={this.toggleAddChannelModal} open={addChannelModal.open} />
                <AddUserToRoleModal
                    key="add-user-to-role-modal"
                    onClose={this.toggleAddUserToRoleModal}
                    open={addUserToRoleModal.open}
                    roleId={addUserToRoleModal.roleId}
                    roleName={addUserToRoleModal.roleName}
                />
            </React.Fragment>
        );
    }
}

export default withApollo(withData(SideBars, ['nowUser', 'pushUp']));

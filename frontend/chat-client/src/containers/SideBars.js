import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import Channels from '../components/Channels';
import Roles from '../components/Roles';
import AddChannelModal from '../components/AddChannelModal';
import AddUserToRoleModal from '../components/AddUserToRoleModal';
import { withData } from '../context/dataContexts';

const newRoleSubscription = gql`
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
`;

class SideBars extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            addChannelModal: { open: false },
            addUserToRoleModal: { open: false, roleId: null, roleName: null },
        };
    }

    componentDidMount() {
        this.onNewRoleSub = this.makeSubscription('New role', 'newRole', this.onNewRole);
    }

    onNewRole = (newRoleData) => {
        console.log('got newroledata', newRoleData);
    };

    makeSubscription = (subName, dataName, onFunc) =>
        this.props.client
            .subscribe({
                query: newRoleSubscription,
            })
            .subscribe({
                next(newData) {
                    if (newData.errors || !newData.data) {
                        console.log('New role subscription data error:', newData.errors);
                        return;
                    }

                    const newMessage = newData.data.newChannelMessage;

                    onFunc(newMessage);
                },
                error(err) {
                    console.error('New role error:', err);
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

        console.log('nowuser', nowUser);

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

export default withApollo(withData(SideBars, ['nowUser']));

import React from 'react';

import Channels from '../components/Channels';
import Roles from '../components/Roles';
import AddChannelModal from '../components/AddChannelModal';
import AddUserToRoleModal from '../components/AddUserToRoleModal';

/*

    -Channel should have a private attribute
        -If channel is private, only connected Roles can view it
        -If channel is not private, connected Roles are ignored

*/

// eslint-disable-next-line arrow-body-style
class SideBars extends React.Component {
    state = {
        addChannelModal: { open: false },
        addUserToRoleModal: { open: false, roleId: null, roleName: null },
    };

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
            username, currentChannelId, viewRoles, userChannels, userPermissions,
        } = this.props;
        const { addChannelModal, addUserToRoleModal } = this.state;

        const canAdd = userPermissions.ADD_ROLE || userPermissions.OWNER;
        const canCreate = userPermissions.OWNER;

        return (
            <React.Fragment>
                <Roles roles={viewRoles} onRoleClick={this.toggleAddUserToRoleModal} canAdd={canAdd} />
                <Channels
                    chatName="Vashta"
                    username={username}
                    currentChannelId={currentChannelId}
                    channels={userChannels}
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

export default SideBars;

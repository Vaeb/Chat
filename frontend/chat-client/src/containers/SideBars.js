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
        openAddChannelModal: false,
        addUserToRoleModal: { open: false, roleId: null, roleName: null },
    };

    handleAddChannelClick = () => {
        this.setState({ openAddChannelModal: true });
    };

    handleAddChannelClose = (resetForm) => {
        resetForm();
        this.setState({ openAddChannelModal: false });
    };

    handleAddUserToRoleClick = (roleId, roleName) => {
        this.setState({ addUserToRoleModal: { open: true, roleId, roleName } }); // not running?
    };

    handleAddUserToRoleClose = (resetForm) => {
        resetForm();
        this.setState({ addUserToRoleModal: { open: false, roleId: null, roleName: null } });
    };

    render() {
        const { username, currentChannelId, viewRoles, userChannels } = this.props;
        const { openAddChannelModal, addUserToRoleModal } = this.state;

        return (
            <React.Fragment>
                {/* <Roles roles={[{ id: 1, name: 'Staff' }, { id: 2, name: 'User' }]} /> */}
                <Roles roles={viewRoles} onRoleClick={this.handleAddUserToRoleClick} />
                <Channels
                    chatName="Vashta"
                    username={username}
                    currentChannelId={currentChannelId}
                    channels={userChannels}
                    onAddChannelClick={this.handleAddChannelClick}
                />
                <AddChannelModal key="add-channel-modal" onClose={this.handleAddChannelClose} open={openAddChannelModal} />
                <AddUserToRoleModal
                    key="add-user-to-role-modal"
                    onClose={this.handleAddUserToRoleClose}
                    open={addUserToRoleModal.open}
                    roleId={addUserToRoleModal.roleId}
                    roleName={addUserToRoleModal.roleName}
                />
            </React.Fragment>
        );
    }
}

export default SideBars;

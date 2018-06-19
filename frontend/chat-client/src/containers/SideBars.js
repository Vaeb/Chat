import React from 'react';

import Channels from '../components/Channels';
import Roles from '../components/Roles';
import AddChannelModal from '../components/AddChannelModal';

/*

    -Channel should have a private attribute
        -If channel is private, only connected Roles can view it
        -If channel is not private, connected Roles are ignored

*/

// eslint-disable-next-line arrow-body-style
class SideBars extends React.Component {
    state = {
        openAddChannelModal: false,
    };

    handleAddChannelClose = (resetForm) => {
        resetForm();
        this.setState({ openAddChannelModal: false });
    };

    handleAddChannelClick = () => {
        this.setState({ openAddChannelModal: true });
    };

    render() {
        const { username, currentChannelId, viewRoles, userChannels } = this.props;
        return (
            <React.Fragment>
                {/* <Roles roles={[{ id: 1, name: 'Staff' }, { id: 2, name: 'User' }]} /> */}
                <Roles roles={viewRoles} />
                <Channels
                    chatName="Vashta"
                    username={username}
                    currentChannelId={currentChannelId}
                    channels={userChannels}
                    onAddChannelClick={this.handleAddChannelClick}
                />
                <AddChannelModal key="add-channel-modal" onClose={this.handleAddChannelClose} open={this.state.openAddChannelModal} />
            </React.Fragment>
        );
    }
}

export default SideBars;

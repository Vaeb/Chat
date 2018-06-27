import React from 'react';

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import SideBars from '../containers/SideBars';
import MessageContainer from '../containers/MessageContainer';

// eslint-disable-next-line react/prefer-stateless-function
class ViewChat extends React.Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.channelId !== this.props.channelId;
    }

    render() {
        console.log('Rendering ViewChat');

        const { channelId, username, channelName } = this.props;

        return (
            <AppLayout>
                <SideBars channelId={channelId} username={username} />
                <Header channelName={channelName} />
                <MessageContainer channelId={channelId} />
                <SendMessage channelId={channelId} channelName={channelName} />
            </AppLayout>
        );
    }
}

export default ViewChat;

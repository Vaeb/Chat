import React from 'react';

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import SideBars from '../containers/SideBars';
import MessageContainer from '../containers/MessageContainer';

// eslint-disable-next-line react/prefer-stateless-function
class ViewChat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isSmall: window.innerWidth <= 760,
        };

        window.addEventListener('resize', this.onResize);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.channelId !== this.props.channelId || nextState.isSmall !== this.state.isSmall;
    }

    onResize = () => {
        const newHide = window.innerWidth <= 760;
        if (newHide !== this.state.isSmall) {
            this.setState({ isSmall: newHide });
        }
    };

    render() {
        console.log('Rendering ViewChat');

        const {
            channelId, userId, username, channelName, chatId,
        } = this.props;

        const { isSmall } = this.state;

        return (
            <AppLayout isSmall={isSmall}>
                <SideBars channelId={channelId} username={username} isSmall={isSmall} />
                <Header channelName={channelName} />
                <MessageContainer channelId={channelId} userId={userId} chatId={chatId} />
                <SendMessage channelId={channelId} userId={userId} username={username} channelName={channelName} chatId={chatId} />
            </AppLayout>
        );
    }
}

export default ViewChat;

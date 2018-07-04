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
            isNarrow: window.innerWidth <= 760,
            // isShort: window.innerHeight <= 560,
        };

        window.addEventListener('resize', this.onResize);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.channelId !== this.props.channelId || nextState.isNarrow !== this.state.isNarrow;
    }

    onResize = () => {
        const newHide = window.innerWidth <= 760;
        if (newHide !== this.state.isNarrow) {
            this.setState({ isNarrow: newHide });
        }
    };

    render() {
        console.log('Rendering ViewChat');

        const {
            channelId, userId, username, channelName, chatId,
        } = this.props;

        const { isNarrow } = this.state;

        return (
            <AppLayout isNarrow={isNarrow}>
                <SideBars channelId={channelId} username={username} isNarrow={isNarrow} />
                <Header channelName={channelName} />
                <MessageContainer channelId={channelId} userId={userId} chatId={chatId} />
                <SendMessage channelId={channelId} userId={userId} username={username} channelName={channelName} chatId={chatId} />
            </AppLayout>
        );
    }
}

export default ViewChat;

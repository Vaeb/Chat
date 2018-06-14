import React from 'react';

import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import SideBars from '../containers/SideBars';

export default () => (
    <AppLayout>
        <SideBars />
        <Header channelName="general" />
        <Messages>
            <ul className="message-list">
                <li />
                <li />
            </ul>
        </Messages>
        <SendMessage channelName="general" />
    </AppLayout>
);

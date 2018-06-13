import React from 'react';

import AppLayout from '../components/AppLayout';
import Channels from '../components/Channels';
import Roles from '../components/Roles';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';

export default () => (
    <AppLayout>
        <Channels
            chatName="Vashta"
            username="Vaeb"
            channels={[{ id: 1, name: 'general' }, { id: 2, name: 'staff' }]}
            // users={[{ id: 1, name: 'vaeb' }, { id: 2, name: 'user1' }]}
        />
        <Header channelName="general" />
        <Messages>
            <ul className="message-list">
                <li />
                <li />
            </ul>
        </Messages>
        <SendMessage />
        <Roles roles={[{ id: 1, name: 'role1' }, { id: 2, name: 'role2' }]} />
    </AppLayout>
);

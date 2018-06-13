import React from 'react';

import AppLayout from '../components/AppLayout';
import Channels from '../components/Channels';
import Roles from '../components/Roles';
import Header from '../components/Header';
import Messages from '../components/Messages';
import Input from '../components/Input';

export default () => (
    <AppLayout>
        <Channels
            chatName="Vashta"
            username=""
            channels={[{ id: 1, name: 'general' }, { id: 2, name: 'staff' }]}
            // users={[{ id: 1, name: 'vaeb' }, { id: 2, name: 'user1' }]}
        />
        <Header>Header</Header>
        <Messages>
            <ul className="message-list">
                <li />
                <li />
            </ul>
        </Messages>
        <Input />
        <Roles>Roles</Roles>
    </AppLayout>
);

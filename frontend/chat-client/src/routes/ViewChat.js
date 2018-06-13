import React from 'react';

import AppLayout from '../components/AppLayout';
import Channels from '../components/Channels';
import Roles from '../components/Roles';
import Header from '../components/Header';
import Messages from '../components/Messages';
import Input from '../components/Input';

export default () => (
    <AppLayout>
        <Channels>Channels</Channels>
        <Header>Header</Header>
        <Messages>
            <ul className="message-list">
                <li />
                <li />
            </ul>
        </Messages>
        <Input>
            <input type="text" placeholder="Message chat" />
        </Input>
        <Roles>Roles</Roles>
    </AppLayout>
);

import React from 'react';
import styled from 'styled-components';

const ChannelWrapper = styled.div`
    grid-column: 1;
    grid-row: 1 / 4;
    background-color: #2f3136;
    color: #72767d;
`;

const channel = ({ id, name }) => <li key={`channel-${id}`}>{`#${name}`}</li>;

export default ({ chatName, username, channels }) => (
    <ChannelWrapper>
        <div>
            {chatName}
            {username}
        </div>
        <div>
            <ul>
                <li>Channels</li>
                {channels.map(channel)}
            </ul>
        </div>
    </ChannelWrapper>
);

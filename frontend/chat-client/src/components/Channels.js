import React from 'react';
import styled from 'styled-components';

const ChannelWrapper = styled.div`
    grid-column: 1;
    grid-row: 1 / 4;
    background-color: #2f3136;
    color: #72767d;
`;

const ChannelHead = styled.div`
    margin-top: 12px;
    padding-left: 10px;
`;

const ChatNameHeader = styled.h1`
    color: #fff;
    font-size: 20px;
`;

const ChannelList = styled.ul`
    width: 100%;
    list-style: none;
    padding-left: 0px;
`;

const ChannelListItem = styled.li`
    padding: 8px 2px 8px 10px;
    font-size: 16px;
    &:hover {
        background-color: #42464d;
        color: #fff;
    }
`;

const channel = ({ id, name }) => <ChannelListItem key={`channel-${id}`}># {name}</ChannelListItem>;

export default ({ chatName, username, channels }) => (
    <ChannelWrapper>
        <ChannelHead>
            <ChatNameHeader>{chatName}</ChatNameHeader>
            {username}
        </ChannelHead>
        <div>
            <ChannelList>{channels.map(channel)}</ChannelList>
        </div>
    </ChannelWrapper>
);

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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

// prettier-ignore
const ChannelListItem = styled.li`
    padding: 8px 2px 8px 10px;
    font-size: 16px;
    color: ${props => (props.current ? '#f6f6f7' : '#72767d')};
    background-color: ${props => (props.current ? 'rgba(79,84,92,.6)' : 'transparent')};
    ${props => (!props.current ? `
    &:hover {
        background-color: #36393f;
        color: #b9bbbe;
    }` : '')};
`;

const channel = ({ id, name, current }) => (
    <Link key={`channel-${id}`} to={`/view-chat/${id}`}>
        <ChannelListItem current={current || false}># {name}</ChannelListItem>
    </Link>
);

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

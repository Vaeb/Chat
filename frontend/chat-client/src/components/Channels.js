import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { withData } from '../context/dataContexts';

const ChannelWrapper = styled.div`
    grid-column: 1;
    grid-row: 1 / 4;
    background-color: #2f3136;
    color: #72767d;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
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
    position: relative;
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

const ButtonListItem = styled.li`
    padding: 8px 2px 8px 10px;
    margin-bottom: 9px;
    font-size: 14px;
    background-color: #151515;
    cursor: pointer;
    width: 100%;
    position: relative;
    top: 14px;
`;

const channel = ({ id, name }, currentChannelId) => (
    <Link key={`channel-${id}`} to={`/view-chat/${id}`}>
        <ChannelListItem current={id === currentChannelId}># {name}</ChannelListItem>
    </Link>
);

const Channels = ({
    chatName, username, onAddChannelClick, canCreate, currentChannelId, chatData: { viewChannels },
}) => (
    <ChannelWrapper>
        <ChannelHead>
            <ChatNameHeader>{chatName}</ChatNameHeader>
            {username}
        </ChannelHead>
        <div>
            <ChannelList>
                {viewChannels.map(c => channel(c, currentChannelId))}
                {canCreate ? (
                    <React.Fragment>
                        <ButtonListItem onClick={onAddChannelClick}>
                            Create Channel{' '}
                            <span>
                                <Icon name="add circle" />
                            </span>
                        </ButtonListItem>
                        <ButtonListItem>
                            Create Role{' '}
                            <span>
                                <Icon name="add circle" />
                            </span>
                        </ButtonListItem>
                    </React.Fragment>
                ) : null}
            </ChannelList>
        </div>
    </ChannelWrapper>
);

export default withData(Channels, ['viewChannels']);

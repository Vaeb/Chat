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
    user-select: none;
`;

const ChannelHead = styled.div`
    margin-top: 12px;
    padding-left: 10px;
`;

const ChatNameHeader = styled.h1`
    color: #fff;
    font-size: 20px;
    margin-bottom: 0px;
`;

const ChannelList = styled.ul`
    width: 100%;
    list-style: none;
    padding-left: 0px;
    position: relative;
`;

// eslint-disable-next-line
// prettier-ignore
const ChannelListItem = styled.li`
    ${props => `
        padding: 8px 2px 8px 10px;
        font-size: 16px;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        height: 35px;
        background-color: ${props.current ? 'rgba(79,84,92,.6)' : 'transparent'};
        color: #72767d;
        & > .channelName {
            color: ${props.current ? '#f6f6f7' : props.newMessages ? '#DCDDDE' : '#72767d'};
        }
        ${!props.current ? `
            &:hover {
                background-color: #36393f;
            }
            &:hover > .channelName {
                ${!props.newMessages ? 'color: #b9bbbe;' : ''}
            }
        ` : ''};
    `};
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
    overflow: hidden;
    white-space: nowrap;
`;

const ChannelTag = styled.li`
    position: absolute;
`;

const ChannelTitle = styled.li`
    position: absolute;
    margin-left: 12px;
`;

const channel = ({ id, name, newMessages }, currentChannelId) => (
    <Link key={`channel-${id}`} to={`/view-chat/${id}`}>
        <ChannelListItem newMessages={newMessages} current={id === currentChannelId}>
            <ChannelTag># </ChannelTag>
            <ChannelTitle className="channelName">{name}</ChannelTitle>
        </ChannelListItem>
    </Link>
);

const Channels = ({
    chatName, username, onAddChannelClick, onAddRoleClick, canCreate, currentChannelId, chatData: { viewChannels },
}) => (
    <ChannelWrapper>
        {console.log('Rendering Channels')}
        <ChannelHead>
            <ChatNameHeader>{chatName}</ChatNameHeader>
            <span>{username}</span>
        </ChannelHead>
        <div>
            <ChannelList>
                {viewChannels.map(c => channel(c, currentChannelId))}
                {canCreate ? (
                    <React.Fragment>
                        <ButtonListItem onClick={onAddChannelClick}>
                            <span>Create Channel </span>
                            <span>
                                <Icon name="add circle" />
                            </span>
                        </ButtonListItem>
                        <ButtonListItem onClick={onAddRoleClick}>
                            <span>Create Role </span>
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

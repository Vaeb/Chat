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
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
`;

const ChannelHeadWrapper = styled.div`
    margin-top: 12px;
    padding-left: 16px;
`;

const ChatNameHeader = styled.h1`
    color: #fff;
    font-size: 20px;
    margin-bottom: 0px;
`;

const ChannelBodyWrapper = styled.div`
    position: relative;
    flex: 1;
`;

const ChannelList = styled.ul`
    width: 100%;
    list-style: none;
    padding-left: 0px;
    position: relative;
`;

// padding: 8px 2px 8px 10px;
// eslint-disable-next-line
// prettier-ignore
const ChannelListItem = styled.li`
    ${props => `
        font-size: 16px;
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        height: 34px;
        margin: 1px 10px 1px 8px;
        padding: 0 8px;
        display: flex;
        align-items: center;
        text-rendering: optimizeLegibility;
        border-radius: 3px;
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

const ChannelTag = styled.span`
    position: absolute;
`;

const ChannelTitle = styled.span`
    position: absolute;
    margin-left: 12px;
`;

// margin: 1px 0 9px 8px;
// padding: 8px 8px 8px 8px;
// border-radius: 3px;
const ButtonListItem = styled.li`
    display: flex;
    justify-content: space-between;
    padding: 8px 16px 8px 16px;
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

const LinkVashtaListItem = styled.li`
    display: flex;
    justify-content: space-between;
    padding: 8px 16px 8px 16px;
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

const channel = ({ id, name, newMessages }, currentChannelId) => (
    <Link key={`channel-${id}`} to={`/view-chat/${id}`}>
        <ChannelListItem newMessages={newMessages} current={id === currentChannelId}>
            <ChannelTag># </ChannelTag>
            <ChannelTitle className="channelName">{name}</ChannelTitle>
        </ChannelListItem>
    </Link>
);

const Channels = ({
    chatName,
    username,
    onAddChannelClick,
    onAddRoleClick,
    onLinkVashtaClick,
    canCreate,
    currentChannelId,
    chatData: {
        viewChannels,
        nowUser: { vashtaUsername },
    },
}) => (
    <ChannelWrapper>
        {console.log('Rendering Channels')}
        <ChannelHeadWrapper>
            <ChatNameHeader>{chatName}</ChatNameHeader>
            <span>{username}</span>
        </ChannelHeadWrapper>
        <ChannelBodyWrapper>
            <ChannelList>
                {viewChannels.map(c => channel(c, currentChannelId))}
                {canCreate ? (
                    <React.Fragment>
                        <ButtonListItem onClick={onAddChannelClick}>
                            <span>
                                <span>Create Channel </span>
                            </span>
                            {/* <span style={{ fontSize: '14px', color: '#FF851B' }}>•</span> */}
                            <span>
                                <Icon name="add circle" style={{ margin: '0 0 0 7px', width: '100%' }} />
                            </span>
                        </ButtonListItem>
                        <ButtonListItem onClick={onAddRoleClick}>
                            <span>
                                <span>Create Role </span>
                            </span>
                            <span>
                                <Icon name="add circle" style={{ margin: '0 0 0 7px', width: '100%' }} />
                            </span>
                        </ButtonListItem>
                    </React.Fragment>
                ) : null}
                {vashtaUsername == null ? (
                    <LinkVashtaListItem onClick={onLinkVashtaClick}>
                        <span>Link Vashta Account</span>
                        <span style={{ fontSize: '14px', color: '#7289da' }}>•</span>
                    </LinkVashtaListItem>
                ) : (
                    <LinkVashtaListItem>
                        <span>Connected to Vashta</span>
                        <span style={{ fontSize: '14px', color: '#4caf50' }}>•</span>
                    </LinkVashtaListItem>
                )}
            </ChannelList>
        </ChannelBodyWrapper>
    </ChannelWrapper>
);

/*
    Purple: #7289da
    Green: #4caf50
    Red: #ef5350
*/

export default withData(Channels, ['viewChannels', 'nowUser']);

import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
// import styled from 'styled-components';
import { Comment } from 'semantic-ui-react';
import DateFormat from 'dateformat';

import Messages from '../components/Messages';

const dayStamp = 1000 * 60 * 60 * 24;
const twoDayStamp = 1000 * 60 * 60 * 24;

const formatDate = (dateStr) => {
    const nowDate = new Date();
    const dateObj = new Date(dateStr);

    const nowStamp = +nowDate;
    const dateStamp = +dateObj;

    const dateDay = dateObj.getDate();
    const todayDay = nowDate.getDate();
    const yesterdayDay = new Date(nowStamp - dayStamp).getDate();

    console.log(dateDay, todayDay, yesterdayDay);

    if (nowStamp - dateStamp < dayStamp && dateDay === todayDay) {
        return `Today at ${DateFormat(dateObj, 'h:MM TT')}`;
    } else if (nowStamp - dateStamp < twoDayStamp && dateDay === yesterdayDay) {
        return `Yesterday at ${DateFormat(dateObj, 'h:MM TT')}`;
    }

    return `${DateFormat(dateObj, 'ddd, mmm dS at h:MM TT')}`;
};

const UseStyle = () => (
    <style>
        {`
            .ui.comments .comment div.text {
                color: hsla(0, 0%, 100%, .7);
                font-size: 0.9375rem;
                line-height: 1.6;
            }

            .ui.comments .comment .metadata .CreatedStamp {
                color: hsla(0,0%,100%,.2);
                font-size: 0.75rem;
            }

            .ui.comments div.comment a.author {
                font-size: 1rem;
            }
        `}
    </style>
);

const MessageContainer = ({ viewMemberData, data: { loading, getMessages: messages } }) =>
    (loading ? (
        <Messages />
    ) : (
        <Messages>
            <UseStyle />
            <Comment.Group>
                {messages.map(m => (
                    <Comment key={`${m.id}-message`}>
                        <Comment.Content>
                            <Comment.Author as="a" style={{ color: viewMemberData[m.user.username].color }}>
                                {m.user.username}
                            </Comment.Author>
                            <Comment.Metadata>
                                <div className="CreatedStamp">{formatDate(m.created_at)}</div>
                            </Comment.Metadata>
                            <Comment.Text>{m.text}</Comment.Text>
                        </Comment.Content>
                    </Comment>
                ))}
            </Comment.Group>
        </Messages>
    ));

const getMessagesQuery = gql`
    query($channelId: Int!) {
        getMessages(channelId: $channelId) {
            id
            text
            user {
                username
            }
            created_at
        }
    }
`;

const getMessageGQL = graphql(getMessagesQuery, {
    options: props => ({
        fetchPolicy: 'network-only',
        variables: {
            channelId: props.channelId,
        },
    }),
});

export default getMessageGQL(MessageContainer);

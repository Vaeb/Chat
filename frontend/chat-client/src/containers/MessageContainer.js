import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
// import styled from 'styled-components';
import { Comment } from 'semantic-ui-react';
import DateFormat from 'dateformat';

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

    // console.log(dateDay, todayDay, yesterdayDay);

    if (nowStamp - dateStamp < dayStamp && dateDay === todayDay) {
        return `Today at ${DateFormat(dateObj, 'h:MM TT')}`;
    } else if (nowStamp - dateStamp < twoDayStamp && dateDay === yesterdayDay) {
        return `Yesterday at ${DateFormat(dateObj, 'h:MM TT')}`;
    }

    return `${DateFormat(dateObj, 'ddd, mmm dS at h:MM TT')}`;
};

const messageWrapperStyle = {
    gridColumn: 2,
    gridRow: 2,
    backgroundColor: '#36393e',
    color: 'hsla(0, 0%, 100%, 0.7)',
    fontFamily: 'Lato, Helvetica Neue, Arial, Helvetica, sans-serif',
    paddingLeft: '20px',
    display: 'flex',
    overflowY: 'auto',
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

            .ui.comments div.comment {
                margin-top: 13px;
            }

            .ui.comments .comment:last-child {
                margin-bottom: 11px;
            }
        `}
    </style>
);

const newChannelMessageSubscription = gql`
    subscription($channelId: Int!) {
        newChannelMessage(channelId: $channelId) {
            id
            text
            user {
                username
            }
            created_at
        }
    }
`;

class MessageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.isScrolledToBottom = true;
    }

    componentWillMount() {
        this.unsubscribe = this.subscribe(this.props.channelId);
    }

    componentDidMount() {
        // console.log('Mounted');

        this.fixScroll();
    }

    componentWillReceiveProps({ data: { getMessages }, channelId }) {
        if (this.props.channelId !== channelId) {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
            this.unsubscribe = this.subscribe(channelId);
        }
    }

    componentDidUpdate() {
        // console.log('Updated');

        this.fixScroll();
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    subscribe = channelId =>
        this.props.data.subscribeToMore({
            document: newChannelMessageSubscription,
            variables: {
                channelId,
            },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData) {
                    return prev;
                }

                return {
                    ...prev,
                    getMessages: [subscriptionData.data.newChannelMessage, ...prev.getMessages],
                };
            },
        });

    fixScroll() {
        const out = document.getElementById('MessageWrapper');

        if (out == null) return;

        // console.log(out.scrollTop);

        if (this.isScrolledToBottom) out.scrollTop = out.scrollHeight - out.clientHeight;

        this.isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;

        // console.log(out.scrollTop, this.isScrolledToBottom, out.scrollHeight - out.clientHeight, out.scrollTop + 1);
    }

    render() {
        const {
            viewMemberData,
            data: { loading, getMessages },
        } = this.props;

        // console.log('Rendering messages');

        return loading ? (
            <div style={messageWrapperStyle} />
        ) : (
            <div id="MessageWrapper" style={messageWrapperStyle}>
                <UseStyle />
                <Comment.Group>
                    {getMessages
                        .slice()
                        .reverse()
                        .map(m => (
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
            </div>
        );
    }
}

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

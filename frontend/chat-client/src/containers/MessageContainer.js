import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import findIndex from 'lodash/findIndex';
// import styled from 'styled-components';
import { Comment } from 'semantic-ui-react';
import DateFormat from 'dateformat';

import { withData } from '../context/dataContexts';

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

    return `${DateFormat(dateObj, 'ddd, mmm dS @ h:MM TT')}`.replace('@', 'at');
};

const messageWrapperStyle = {
    gridColumn: 2,
    gridRow: 2,
    backgroundColor: '#36393e',
    color: 'hsla(0, 0%, 100%, 0.7)',
    fontFamily: 'Open Sans, Lato, Helvetica Neue, Arial, Helvetica, sans-serif',
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

            .ui.comments .comment div.avatar img, .ui.comments .comment img.avatar {
                border-radius: 50%;
            }
        `}
    </style>
);

const newChannelMessageSubscription = gql`
    subscription {
        newChannelMessage {
            id
            text
            user {
                id
                username
            }
            channel {
                id
            }
            created_at
            chatId
        }
    }
`;

const getMessagesQuery = gql`
    query {
        allMessages {
            id
            text
            user {
                id
                username
            }
            channel {
                id
            }
            created_at
        }
    }
`;

class MessageContainer extends React.Component {
    constructor(props) {
        super(props);
        this.isScrolledToBottom = true;
        this.allMessages = {};

        this.state = {
            viewMessages: [],
        };
    }

    componentDidMount() {
        // console.log('Mounted');

        this.props.client
            .query({
                query: getMessagesQuery,
                fetchPolicy: 'network-only',
            })
            .then(({ loading, data }) => {
                if (loading) {
                    console.log('Message query loading data...');
                    return;
                }

                const { allMessages } = data;

                console.log('Got messages!');

                for (let i = 0; i < allMessages.length; i++) {
                    const channelMessages = allMessages[i];

                    if (channelMessages.length > 0) {
                        this.allMessages[channelMessages[0].channel.id] = channelMessages.slice();
                    }
                }

                if (!this.allMessages[this.props.channelId]) {
                    this.allMessages[this.props.channelId] = [];
                }

                this.subscriptionObserver = this.subscribe(this.props.chatId, this.newMessage);

                this.setState({ viewMessages: [...this.allMessages[this.props.channelId]] });
            });
        this.fixScroll();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.channelId !== this.props.channelId) {
            this.setState({ viewMessages: this.allMessages[nextProps.channelId] ? [...this.allMessages[nextProps.channelId]] : [] });
        }
    }

    componentWillUpdate({ chatData: { selfMessage } }) {
        const selfMessages = selfMessage.getSelfMessages();
        selfMessages.forEach(({ message, tmpId }) => {
            const newChannelId = message.channel.id;

            const existingIndex = findIndex(this.allMessages[newChannelId] || [], ['id', tmpId]);
            const isTemp = message.id === tmpId;

            if (existingIndex === -1) {
                if (isTemp) message.temp = true;
                this.newMessage(message);
            } else if (!isTemp) {
                this.allMessages[newChannelId][existingIndex] = message;

                if (newChannelId === this.props.channelId) {
                    this.setState({ viewMessages: [...this.allMessages[newChannelId]] });
                }
            }
        });
    }

    componentDidUpdate() {
        this.fixScroll();
    }

    componentWillUnmount() {
        if (this.subscriptionObserver) {
            this.subscriptionObserver.unsubscribe();
            this.subscriptionObserver = null;
        }
    }

    newMessage = (message) => {
        const newChannelId = message.channel.id;

        if (!this.allMessages[newChannelId]) {
            this.allMessages[newChannelId] = [];
        }

        const channelMessages = this.allMessages[newChannelId];

        channelMessages.unshift(message);

        if (newChannelId === this.props.channelId) {
            this.setState({ viewMessages: [...channelMessages] });
        }

        this.props.chatData.pushUp.newMessage(message);
    };

    subscribe = (chatId, newMessage) =>
        this.props.client
            .subscribe({
                query: newChannelMessageSubscription,
            })
            .subscribe({
                next(newData) {
                    if (newData.errors || !newData.data) {
                        console.log('Message subscription data error:', newData.errors);
                        return;
                    }

                    const message = newData.data.newChannelMessage;

                    if (!message.chatId || message.chatId !== chatId) newMessage(message);
                },
                error(err) {
                    console.error('Message subscription error:', err);
                },
            });

    fixScroll = () => {
        const out = document.getElementById('MessageWrapper');

        if (out == null) return;

        // console.log(out.scrollTop);

        if (this.isScrolledToBottom) out.scrollTop = out.scrollHeight - out.clientHeight;

        this.isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;

        // console.log(out.scrollTop, this.isScrolledToBottom, out.scrollHeight - out.clientHeight, out.scrollTop + 1);
    };

    render() {
        const {
            chatData: { allUsers },
        } = this.props;

        console.log('Rendering MessageContainer');

        return (
            <div id="MessageWrapper" style={messageWrapperStyle}>
                <UseStyle />
                <Comment.Group>
                    {this.state.viewMessages
                        .slice()
                        .reverse()
                        .map(m => (
                            <Comment key={`${m.id}-message`}>
                                <Comment.Avatar src="/avatar4.jpg" />
                                <Comment.Content>
                                    <Comment.Author as="a" style={{ color: allUsers[m.user.id] ? allUsers[m.user.id].color : '#B9BBBE' }}>
                                        {m.user.username}
                                    </Comment.Author>
                                    <Comment.Metadata>
                                        <div className="CreatedStamp">{formatDate(m.created_at)}</div>
                                    </Comment.Metadata>
                                    <Comment.Text style={{ color: !m.temp ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.4)' }}>
                                        {m.text}
                                    </Comment.Text>
                                </Comment.Content>
                            </Comment>
                        ))}
                </Comment.Group>
            </div>
        );
    }
}

export default withApollo(withData(MessageContainer, ['allUsers', 'pushUp', 'selfMessage']));

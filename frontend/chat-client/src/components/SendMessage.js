import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import { withData } from '../context/dataContexts';

const SendMessageWrapper = styled.div`
    grid-column: 2;
    grid-row: 3;
    background-color: #36393e;
    border-width: 0px;
    border-top: 1px solid #eceeef;
    border-top-color: hsla(0, 0%, 100%, 0.04);
`;

const UseStyle = () => (
    <style>
        {`
            .SendMessageInput {
                padding: 0.5em;
                border: none;
                height: 100%;
            }

            .SendMessageInput > input {
                background-color: hsla(218, 5%, 47%, 0.3) !important;
                color: hsla(0, 0%, 100%, 0.7) !important;
            }

            .SendMessageInput > input::selection {
                color: hsla(0, 0%, 100%, 0.3) !important;
            }
        `}
    </style>
);

const ENTER_KEY = 13;

const SendMessage = ({
    channelName, values, handleChange, handleBlur, handleSubmit, isSubmitting, chatData: { selfMessage },
}) => (
    <SendMessageWrapper>
        <UseStyle />
        <Input
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
                if (e.keyCode === ENTER_KEY && !isSubmitting) {
                    handleSubmit(e);
                }
            }}
            className="SendMessageInput"
            inverted
            fluid
            placeholder={`Message #${channelName}`}
        />
    </SendMessageWrapper>
);

const createMessageMutation = gql`
    mutation($channelId: Int!, $text: String!, $chatId: String) {
        createMessage(channelId: $channelId, text: $text, chatId: $chatId) {
            ok
            errors {
                path
                message
            }
            message {
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
    }
`;

const formikData = {
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (
        values,
        {
            props: {
                mutate,
                channelId,
                userId,
                username,
                chatId,
                chatData: { selfMessage },
            },
            setSubmitting,
            resetForm,
        },
    ) => {
        if (values.message.trim() === '') {
            setSubmitting(false);
            return;
        }

        resetForm();

        console.log('Submitting...', chatId, typeof chatId);
        let response;

        const nowTime = new Date();
        const nowStamp = +nowTime;

        try {
            response = await mutate({
                variables: { channelId, text: values.message, chatId },
                optimisticResponse: {
                    createMessage: {
                        __typename: 'Mutation',
                        ok: true,
                        errors: [],
                        message: {
                            __typename: 'Message',
                            id: nowStamp,
                            text: values.message,
                            user: { __typename: 'User', id: userId, username },
                            channel: { __typename: 'Channel', id: channelId },
                            created_at: nowTime,
                            chatId,
                        },
                    },
                },
                update: (proxy, { data: { createMessage } }) => {
                    const { ok, message } = createMessage;
                    if (!ok) {
                        console.log('Mutation errored');
                        return;
                    }

                    selfMessage.newSelfMessage({ message, tmpId: nowStamp });
                },
            });
        } catch (err) {
            console.log('SendMessage Error:', err);
        }

        if (response) console.log('Sent:', response.data.createMessage);

        /* const { ok, errors } = response.data.createMessage;

        if (!ok) console.log(errors); */
    },
};

export default withData(
    compose(
        graphql(createMessageMutation),
        withFormik(formikData),
    )(SendMessage),
    ['selfMessage'],
);

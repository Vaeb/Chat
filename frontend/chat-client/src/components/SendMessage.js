import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

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
    channelName, values, handleChange, handleBlur, handleSubmit, isSubmitting,
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
    mutation($channelId: Int!, $text: String!) {
        createMessage(channelId: $channelId, text: $text) {
            ok
            message {
                id
                text
            }
            errors {
                path
                message
            }
        }
    }
`;

const formikData = {
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (values, { props: { mutate, channelId }, setSubmitting, resetForm }) => {
        if (values.message.trim() === '') {
            setSubmitting(false);
            return;
        }

        resetForm();

        console.log('Submitting...');
        let response;

        try {
            response = await mutate({
                variables: { channelId, text: values.message },
                /* optimisticResponse: {
                    createMessage: {
                        __typename: 'Mutation',
                        ok: true,
                        message: {
                            __typename: 'Message',
                            id: 999999, // Go to bottom
                            text: values.message,
                        },
                    },
                },
                update: (proxy, { data: { createMessage } }) => {
                    console.log(createMessage);
                }, */
            });
        } catch (err) {}

        const { ok, errors } = response.data.createMessage;

        if (!ok) console.log(errors);
    },
};

export default compose(
    graphql(createMessageMutation),
    withFormik(formikData),
)(SendMessage);

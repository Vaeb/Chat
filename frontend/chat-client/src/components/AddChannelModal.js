import React from 'react';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { viewQuery } from '../graphql/chat';

const AddChannelModal = ({
    /* errors, touched, */
    open,
    onClose,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm,
}) => (
    <Modal open={open} onClose={() => onClose(resetForm)}>
        <Modal.Header>Add Channel</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    <Input
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        inverted
                        autoComplete="off"
                        fluid
                        focus
                        placeholder="Channel Name"
                    />
                </Form.Field>
                <Form.Group widths="equal">
                    <Form.Field>
                        <Button disabled={isSubmitting} onClick={() => onClose(resetForm)} fluid>
                            Cancel
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Button disabled={isSubmitting} onClick={handleSubmit} fluid>
                            Create Channel
                        </Button>
                    </Form.Field>
                </Form.Group>
            </Form>
        </Modal.Content>
    </Modal>
);

/* const AddChannelModal = ({ open, onClose }) => (
    <Modal open={open} onClose={onClose}>
        <Modal.Header>Add Channel</Modal.Header>
        <Modal.Content>
            <Modal.Description>
                <Header>Default Profile Image</Header>
                <p> qq.</p>
                <p>Is it okay to use this photo?</p>
            </Modal.Description>
        </Modal.Content>
    </Modal>
); */

const createChannelMutation = gql`
    mutation($name: String!) {
        createChannel(name: $name) {
            ok
            channel {
                id
                name
                locked
                roles {
                    id
                }
            }
        }
    }
`;

const formikData = {
    mapPropsToValues: (/* props */) => ({ name: '' }),
    /* validate: (values, props) => {
        const errors = {};
        if (!values.name) {
            errors.name = 'Required';
        } else if (!/^[0-9a-z_-]+$/i.test(values.name)) {
            errors.name = 'Channel names must only contain letters, numbers, underscores and hyphens';
        }
        return errors;
    }, */
    handleSubmit: async (values, { props: { mutate, onClose }, setSubmitting, resetForm /* setErrors, setValues, setStatus, etc. */ }) => {
        console.log('Submitting...');
        let response;

        try {
            response = await mutate({
                variables: { name: values.name },
                optimisticResponse: {
                    createChannel: {
                        __typename: 'Mutation',
                        ok: true,
                        channel: {
                            __typename: 'Channel',
                            id: 999999, // Go to bottom
                            name: values.name,
                            locked: false,
                            roles: [],
                        },
                    },
                },
                update: (proxy, { data: { createChannel } }) => {
                    const { ok, channel } = createChannel;
                    if (!ok) {
                        return;
                    }
                    const data = proxy.readQuery({ query: viewQuery });
                    data.chatData.openChannels.push(channel);
                    proxy.writeQuery({ query: viewQuery, data });
                },
            });
        } catch (err) {} // I broke eslint :FeelsBadMan:
        console.log(response);
        onClose(resetForm);
        setSubmitting(false);
    },
};

export default compose(
    graphql(createChannelMutation),
    withFormik(formikData)
)(AddChannelModal);

import React from 'react';
import { Form, Button, Modal, Input, Checkbox } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { withData } from '../context/dataContexts';

import MultiSelectUsers from './MultiSelectRoles';

const AddChannelModal = ({
    /* errors, touched, */
    chatData: { allRoles },
    open,
    onClose,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm,
    setFieldValue,
}) => (
    <Modal open={open} onClose={e => onClose({ e, resetForm })}>
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
                <Form.Field>
                    <Checkbox
                        checked={values.locked}
                        label="Private"
                        onChange={(e, { checked }) => setFieldValue('locked', checked)}
                        toggle
                    />
                </Form.Field>
                {values.locked ? (
                    <Form.Field>
                        <MultiSelectUsers
                            allRoles={allRoles}
                            value={values.roles}
                            handleChange={(e, { value }) => setFieldValue('roles', value)}
                            placeholder="Who can access this channel?"
                        />
                    </Form.Field>
                ) : null}
                <Form.Group widths="equal">
                    <Form.Field>
                        <Button disabled={isSubmitting} onClick={e => onClose({ e, resetForm })} fluid>
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
    mutation($name: String!, $locked: Boolean, $roles: [Int!]) {
        createChannel(name: $name, locked: $locked, roles: $roles) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

const formikData = {
    mapPropsToValues: () => ({ name: '', locked: false, roles: [] }),
    handleSubmit: async (values, { props: { mutate, onClose }, setSubmitting, resetForm /* setErrors, setValues, setStatus, etc. */ }) => {
        console.log('Submitting...');
        console.log({ name: values.name, locked: values.locked, roles: values.roles });

        let response;
        try {
            response = await mutate({
                variables: { name: values.name, locked: values.locked, roles: values.roles },
            });
        } catch (err) {} // I broke eslint :FeelsBadMan:

        console.log(response);

        onClose({ resetForm });
        setSubmitting(false);
    },
};

export default compose(
    graphql(createChannelMutation),
    withFormik(formikData),
)(withData(AddChannelModal, ['allRoles']));

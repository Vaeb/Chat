import React from 'react';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

import { normalizeErrors, pickError } from '../../normalizeErrors';

const AddUserToRoleModal = ({
    /* errors, touched, */
    roleName,
    open,
    onClose,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm,
    touched,
    errors,
}) => (
    <Modal open={open} onClose={e => onClose({ e, resetForm })}>
        <Modal.Header>Add User To {roleName}</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    <Input
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        inverted
                        autoComplete="off"
                        fluid
                        focus
                        placeholder="Username"
                    />
                </Form.Field>
                {pickError(touched, errors, ['username'])}
                <Form.Group widths="equal">
                    <Form.Field>
                        <Button disabled={isSubmitting} onClick={e => onClose({ e, resetForm })} fluid>
                            Cancel
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Button disabled={isSubmitting} onClick={handleSubmit} fluid>
                            Confirm
                        </Button>
                    </Form.Field>
                </Form.Group>
            </Form>
        </Modal.Content>
    </Modal>
);

const addUserToRoleMutation = gql`
    mutation($username: String!, $roleId: Int!) {
        addUserToRole(username: $username, roleId: $roleId) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

const formikData = {
    mapPropsToValues: () => ({ username: '' }),
    handleSubmit: async (
        values,
        { props: { mutate, onClose, roleId }, setSubmitting, resetForm, setErrors /* setValues, setStatus, etc. */ },
    ) => {
        console.log('Submitting...');
        let response;

        try {
            response = await mutate({
                variables: { username: values.username, roleId },
            });
        } catch (err) {}

        console.log('Response:', response);

        const { ok, errors } = response ? response.data.addUserToRole : {};

        setSubmitting(false);

        if (ok) {
            onClose({ resetForm });
        } else if (errors) {
            setErrors(normalizeErrors(errors));
        }
    },
};

export default compose(
    graphql(addUserToRoleMutation),
    withFormik(formikData),
)(AddUserToRoleModal);

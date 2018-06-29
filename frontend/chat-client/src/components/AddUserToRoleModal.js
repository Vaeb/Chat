import React from 'react';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
// import findIndex from 'lodash/findIndex';

// import { viewQuery } from '../graphql/chat';
import { normalizeErrors, chooseError } from '../normalizeErrors';

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
                {chooseError(touched, errors, ['username'])}
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
                /* update: (proxy, { data: { addUserToRole } }) => {
                    const { ok, user } = addUserToRole;
                    if (!ok) {
                        console.log('Mutation errored');
                        return;
                    }

                    const data = proxy.readQuery({ query: viewQuery });
                    const {
                        chatData: { allRoles },
                    } = data;

                    const cachedRoleIndex = findIndex(allRoles, ['id', roleId]);

                    if (cachedRoleIndex === -1) {
                        console.log('Weird error, mutation success but no role found with id');
                        return;
                    }

                    const cachedRole = allRoles[cachedRoleIndex];
                    const cachedRoleMembers = cachedRole.members;
                    cachedRoleMembers.push(user);

                    proxy.writeQuery({ query: viewQuery, data });
                }, */
            });
        } catch (err) {}

        console.log('Response:', response);

        const { ok, errors } = response.data.addUserToRole;

        if (ok) {
            onClose({ resetForm });
            setSubmitting(false);
        } else {
            setSubmitting(false);
            setErrors(normalizeErrors(errors));
        }
    },
};

export default compose(
    graphql(addUserToRoleMutation),
    withFormik(formikData),
)(AddUserToRoleModal);

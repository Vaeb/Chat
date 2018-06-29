import React from 'react';
import { Form, Button, Modal, Input, Checkbox } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';

const AddRoleModal = ({
    open, onClose, values, handleChange, handleBlur, handleSubmit, isSubmitting, resetForm, setFieldValue,
}) => (
    <Modal open={open} onClose={e => onClose({ e, resetForm })}>
        <Modal.Header>Add Role</Modal.Header>
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
                        placeholder="Role Name"
                    />
                </Form.Field>
                <Form.Field>
                    <Checkbox
                        checked={values.view}
                        label="View in sidebar"
                        onChange={(e, { checked }) => setFieldValue('view', checked)}
                        toggle
                    />
                </Form.Field>
                <Form.Group widths="equal">
                    <Form.Field>
                        <Button disabled={isSubmitting} onClick={e => onClose({ e, resetForm })} fluid>
                            Cancel
                        </Button>
                    </Form.Field>
                    <Form.Field>
                        <Button disabled={isSubmitting} onClick={handleSubmit} fluid>
                            Create Role
                        </Button>
                    </Form.Field>
                </Form.Group>
            </Form>
        </Modal.Content>
    </Modal>
);

const createRoleMutation = gql`
    mutation($name: String!, $view: Boolean) {
        createRole(name: $name, view: $view) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

const formikData = {
    mapPropsToValues: () => ({ name: '', view: true }),
    handleSubmit: async (values, { props: { mutate, onClose }, setSubmitting, resetForm }) => {
        console.log('Submitting...');

        let response;
        try {
            response = await mutate({
                variables: { name: values.name, view: values.view },
            });
        } catch (err) {}

        console.log(response);

        onClose({ resetForm });
        setSubmitting(false);
    },
};

export default compose(
    graphql(createRoleMutation),
    withFormik(formikData),
)(AddRoleModal);

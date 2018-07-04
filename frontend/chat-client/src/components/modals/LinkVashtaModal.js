import React from 'react';
import { Form, Button, Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import Modal from 'react-responsive-modal';

import { normalizeErrors, pickError } from '../../normalizeErrors';
import './ModalStyling.css';

const UseStyle = () => (
    <style>
        {`
            .ui.labeled.input div.label {
                min-width: 134px;
            }            
        `}
    </style>
);

class LinkVashtaModal extends React.Component {
    changeHandler = (e) => {
        if (!e.isTrusted) return;
        this.props.handleChange(e);
    };

    render() {
        const {
            /* errors, touched, */
            open,
            onClose,
            values,
            handleBlur,
            handleSubmit,
            isSubmitting,
            resetForm,
            touched,
            errors,
        } = this.props;

        return (
            <React.Fragment>
                <UseStyle />
                <Modal
                    open={open}
                    onClose={e => onClose({ e, resetForm })}
                    center
                    classNames={{ overlay: 'custom-overlay', modal: 'custom-modal' }}
                >
                    <div className="modalHeader">Link Vashta Account</div>
                    <div className="modalContent">
                        <Form>
                            <Form.Field>
                                <Input
                                    name="vashtaU"
                                    value={values.vashtaU}
                                    onChange={this.changeHandler}
                                    onBlur={handleBlur}
                                    label="Vashta Username"
                                    inverted
                                    autoComplete="off"
                                    fluid
                                    focus
                                    placeholder="Vashta Dashboard Username"
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    name="vashtaP"
                                    value={values.vashtaP}
                                    onChange={this.changeHandler}
                                    onBlur={handleBlur}
                                    label="Vashta Password"
                                    inverted
                                    autoComplete="off"
                                    type="password"
                                    fluid
                                    focus
                                    placeholder="Vashta Dashboard Password"
                                />
                            </Form.Field>
                            {pickError(touched, errors, ['username', 'password'])}
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
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}

const linkVashtaMutation = gql`
    mutation($username: String!, $password: String!) {
        linkVashta(username: $username, password: $password) {
            ok
            errors {
                path
                message
            }
            vashtaUser {
                username
            }
        }
    }
`;

const formikData = {
    mapPropsToValues: () => ({ vashtaU: '', vashtaP: '' }),
    handleSubmit: async (values, { props: { mutate, onClose }, setSubmitting, resetForm, setErrors /* setValues, setStatus, etc. */ }) => {
        console.log('Submitting...', values.vashtaU, values.vashtaP);
        let response;

        try {
            response = await mutate({
                variables: { username: values.vashtaU, password: values.vashtaP },
            });
        } catch (err) {
            console.log('Mutation failed:', err);
        }

        console.log('Response:', response);

        const { ok, errors } = response ? response.data.linkVashta : {};

        setSubmitting(false);

        if (ok) {
            onClose({ resetForm });
        } else if (errors) {
            setErrors(normalizeErrors(errors));
        }
    },
};

export default compose(
    graphql(linkVashtaMutation),
    withFormik(formikData),
)(LinkVashtaModal);

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
                                    name="vashtaE"
                                    value={values.vashtaE}
                                    onChange={this.changeHandler}
                                    onBlur={handleBlur}
                                    label="Vashta Email"
                                    inverted
                                    autoComplete="off"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleSubmit(e);
                                    }}
                                    fluid
                                    focus
                                    placeholder="Vashta Dashboard Email"
                                    readOnly
                                    onFocus={(e) => {
                                        const inp = e.target;
                                        if (inp.hasAttribute('readonly')) {
                                            inp.removeAttribute('readonly');
                                            inp.blur();
                                            inp.focus();
                                        }
                                    }}
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
                                    autoComplete="new-password"
                                    type="password"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleSubmit(e);
                                    }}
                                    fluid
                                    focus
                                    placeholder="Vashta Dashboard Password"
                                    readOnly
                                    onFocus={(e) => {
                                        const inp = e.target;
                                        if (inp.hasAttribute('readonly')) {
                                            inp.removeAttribute('readonly');
                                            inp.blur();
                                            inp.focus();
                                        }
                                    }}
                                />
                            </Form.Field>
                            {pickError(touched, errors, ['email', 'password'])}
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
    mutation($email: String!, $password: String!) {
        linkVashta(email: $email, password: $password) {
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
    mapPropsToValues: () => ({ vashtaE: '', vashtaP: '' }),
    handleSubmit: async (values, { props: { mutate, onClose }, setSubmitting, resetForm, setErrors /* setValues, setStatus, etc. */ }) => {
        console.log('Submitting...', values.vashtaE, values.vashtaP);
        let response;

        try {
            response = await mutate({
                variables: { email: values.vashtaE, password: values.vashtaP },
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

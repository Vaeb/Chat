import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const registerLocked = false;

const styles = {
    Container: {
        marginTop: '50px',
    },
};

class Register extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            username: '',
            email: '',
            password: '',
            errors: {},
        });
    }

    onChange = (e) => {
        const { name, value } = e.target;
        this[name] = value;
    };

    onSubmit = async () => {
        const { username, email, password } = this;

        let response;

        try {
            response = await this.props.mutate({
                variables: { username, email, password },
            });
        } catch (err) {
            console.log('[BACKEND ERROR - This could be because your submitted data contained incorrect data types] ', err);
            this.props.history.push('/');
            return;
        }

        const { ok, errors } = response.data.register;

        if (ok) {
            this.props.history.push('/login');
        } else {
            const err = {};

            errors.forEach(({ path, message }) => {
                // path is column name
                err[`${path}Error`] = message.charAt(0).toUpperCase() + message.slice(1);
            });

            this.errors = err;
        }
    };

    render() {
        const {
            username,
            email,
            password,
            errors: { usernameError, emailError, passwordError },
        } = this;

        const errorList = [];

        if (registerLocked) errorList.push('Registrations are closed right now.');
        if (usernameError) errorList.push(usernameError);
        if (emailError) errorList.push(emailError);
        if (passwordError) errorList.push(passwordError);

        return (
            <Container text style={styles.Container}>
                <Header as="h2">Register</Header>
                <Form>
                    <Form.Field error={!!usernameError}>
                        <Input name="username" onChange={this.onChange} value={username} placeholder="Username" fluid />
                    </Form.Field>
                    <Form.Field error={!!emailError}>
                        <Input name="email" onChange={this.onChange} value={email} placeholder="Email" fluid />
                    </Form.Field>
                    <Form.Field error={!!passwordError}>
                        <Input name="password" onChange={this.onChange} value={password} type="password" placeholder="Password" fluid />
                    </Form.Field>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button style={{ marginRight: 'auto' }} onClick={this.onSubmit}>
                            Submit
                        </Button>
                        <div style={{ marginRight: '10px' }}>Already signed up?</div>
                        <Button onClick={() => this.props.history.push('/login')}>Login</Button>
                    </div>
                </Form>

                {errorList.length ? <Message error header="There were some errors with your submission" list={errorList} /> : null}
            </Container>
        );
    }
}

const registerMutation = gql`
    mutation($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(registerMutation)(observer(Register));

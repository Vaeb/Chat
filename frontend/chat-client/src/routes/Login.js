import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const styles = {
    Container: {
        marginTop: '50px',
    },
};

class Login extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
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
        const { email, password } = this;

        let response;

        try {
            response = await this.props.mutate({
                variables: { email, password },
            });
        } catch (err) {
            console.log('[BACKEND ERROR - This could be because your submitted data contained incorrect data types] ', err);
            this.props.history.push('/');
            return;
        }

        console.log(response);

        const { ok, errors, token, refreshToken } = response.data.login;

        if (ok) {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            this.props.history.push('/view-chat/1');
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
            email,
            password,
            errors: { emailError, passwordError },
        } = this;

        const errorList = [];

        if (emailError) errorList.push(emailError);
        if (passwordError) errorList.push(passwordError);

        return (
            <Container text style={styles.Container}>
                <Header as="h2">Login</Header>
                <Form>
                    <Form.Field error={!!emailError}>
                        <Input name="email" onChange={this.onChange} value={email} placeholder="Username or Email" fluid />
                    </Form.Field>
                    <Form.Field error={!!passwordError}>
                        <Input name="password" onChange={this.onChange} value={password} type="password" placeholder="Password" fluid />
                    </Form.Field>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Button style={{ marginRight: 'auto' }} onClick={this.onSubmit}>
                            Submit
                        </Button>
                        <div style={{ marginRight: '10px' }}>Haven't signed up yet?</div>
                        <Button onClick={() => this.props.history.push('/register')}>Register</Button>
                    </div>
                </Form>

                {errorList.length ? <Message error header="There were some errors with your submission" list={errorList} /> : null}
            </Container>
        );
    }
}

const loginMutation = gql`
    mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            ok
            token
            refreshToken
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(loginMutation)(observer(Login));

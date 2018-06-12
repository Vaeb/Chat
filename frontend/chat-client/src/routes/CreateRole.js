import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

/* function isInt(value) {
    return !isNaN(value) && parseInt(Number(value), 10) == value && !isNaN(parseInt(value, 10));
} */

class CreateRole extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            name: '',
            position: undefined,
            color: undefined,
            errors: {},
        });
    }

    onChange = (e) => {
        const { name, value } = e.target;
        this[name] = value;
    };

    onSubmit = async () => {
        const { name, color } = this;
        let { position } = this;

        if (position == 0) position = undefined;

        /* if (position !== undefined) {
            if (!isInt(position)) {
                this.errors = { positionError: 'The position must be an integer' };
                return;
            }

            position = parseInt(position, 10);
        } */

        let response;

        try {
            response = await this.props.mutate({ variables: { name, position, color } });
        } catch (err) {
            this.props.history.push('/login');
            return;
        }

        console.log(response);

        const { ok, errors } = response.data.createRole;

        if (ok) {
            this.props.history.push('/');
        } else {
            const err = {};

            errors.forEach(({ path, message }) => {
                // path is column name
                console.log('found error:', path, '|', message);
                err[`${path}Error`] = message.charAt(0).toUpperCase() + message.slice(1);
            });

            this.errors = err;
        }
    };

    render() {
        const {
            name,
            position,
            color,
            errors: { nameError, positionError, colorError },
        } = this;

        const errorList = [];

        if (nameError) errorList.push(nameError);
        if (positionError) errorList.push(positionError);
        if (colorError) errorList.push(colorError);

        const positionVal = position === undefined ? '' : position;
        const colorVal = color === undefined ? '' : color;

        return (
            <Container text>
                <Header as="h2">Create Role</Header>
                <Form>
                    <Form.Field error={!!nameError}>
                        <Input name="name" onChange={this.onChange} value={name} placeholder="Name" fluid />
                    </Form.Field>
                    <Form.Field error={!!positionError}>
                        <Input name="position" onChange={this.onChange} value={positionVal} placeholder="Position (Optional)" fluid />
                    </Form.Field>
                    <Form.Field error={!!colorError}>
                        <Input name="color" onChange={this.onChange} value={colorVal} placeholder="Color (Optional)" fluid />
                    </Form.Field>

                    <Button onClick={this.onSubmit}>Submit</Button>
                </Form>

                {errorList.length ? <Message error header="There were some errors with your submission" list={errorList} /> : null}
            </Container>
        );
    }
}

const createRoleMutation = gql`
    mutation($name: String!, $color: String, $position: String) {
        createRole(name: $name, color: $color, position: $position) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(createRoleMutation)(observer(CreateRole));

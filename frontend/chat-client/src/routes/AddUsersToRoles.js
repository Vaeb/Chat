import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class AddUsersToRoles extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            userIds: '',
            roleIds: '',
            errors: {},
        });
    }

    onChange = (e) => {
        const { name, value } = e.target;
        this[name] = value;
    };

    onSubmit = async () => {
        let { userIds, roleIds } = this;

        userIds = userIds.split(' ').filter(id => id.length > 0);
        roleIds = roleIds.split(' ').filter(id => id.length > 0);

        let response;

        try {
            response = await this.props.mutate({ variables: { userIds, roleIds } });
        } catch (err) {
            console.log('BACKEND ERROR:', err);
            this.props.history.push('/login');
            return;
        }

        console.log(response);

        const { ok, errors } = response.data.addUsersToRoles;

        if (ok) {
            this.props.history.push('/');
        } else {
            const err = {};

            errors.forEach(({ path, message }) => {
                // path is column name
                console.log('found error:', path, '|', message);
                err[`${path}Error`] = message.charAt(0).toUpperCase() + message.slice(1);
            });

            console.log('======================');
            console.log(userIds);
            console.log(roleIds);
            console.log('======================');

            this.errors = err;
        }
    };

    render() {
        const {
            userIds,
            roleIds,
            errors: { userIdsError, roleIdsError },
        } = this;

        const errorList = [];

        if (userIdsError) errorList.push(userIdsError);
        if (roleIdsError) errorList.push(roleIdsError);

        return (
            <Container text>
                <Header as="h2">Add Users to Roles</Header>
                <Form>
                    <Form.Field error={!!userIdsError}>
                        <Input
                            name="userIds"
                            onChange={this.onChange}
                            value={userIds}
                            placeholder="User IDs (Separated by a single space)"
                            fluid
                        />
                    </Form.Field>
                    <Form.Field error={!!roleIdsError}>
                        <Input
                            name="roleIds"
                            onChange={this.onChange}
                            value={roleIds}
                            placeholder="Role IDs (Separated by a single space)"
                            fluid
                        />
                    </Form.Field>

                    <Button onClick={this.onSubmit}>Submit</Button>
                </Form>

                {errorList.length ? <Message error header="There were some errors with your submission" list={errorList} /> : null}
            </Container>
        );
    }
}

const addUsersToRolesMutation = gql`
    mutation($userIds: [String!]!, $roleIds: [String!]!) {
        addUsersToRoles(userIds: $userIds, roleIds: $roleIds) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(addUsersToRolesMutation)(observer(AddUsersToRoles));

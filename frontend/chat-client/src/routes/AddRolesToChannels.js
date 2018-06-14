import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class AddRolesToChannels extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            roleIds: '',
            channelIds: '',
            errors: {},
        });
    }

    onChange = (e) => {
        const { name, value } = e.target;
        this[name] = value;
    };

    onSubmit = async () => {
        let { roleIds, channelIds } = this;

        roleIds = roleIds.split(' ').filter(id => id.length > 0);
        channelIds = channelIds.split(' ').filter(id => id.length > 0);

        let response;

        try {
            response = await this.props.mutate({ variables: { roleIds, channelIds } });
        } catch (err) {
            console.log('ERROR:', err);
            this.props.history.push('/login');
            return;
        }

        console.log(response);

        const { ok, errors } = response.data.addRolesToChannels;

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
            console.log(roleIds);
            console.log(channelIds);
            console.log('======================');

            this.errors = err;
        }
    };

    render() {
        const {
            roleIds,
            channelIds,
            errors: { roleIdsError, channelIdsError },
        } = this;

        const errorList = [];

        if (roleIdsError) errorList.push(roleIdsError);
        if (channelIdsError) errorList.push(channelIdsError);

        return (
            <Container text>
                <Header as="h2">Add Roles to Channels</Header>
                <Form>
                    <Form.Field error={!!roleIdsError}>
                        <Input
                            name="roleIds"
                            onChange={this.onChange}
                            value={roleIds}
                            placeholder="Role IDs (Separated by a single space)"
                            fluid
                        />
                    </Form.Field>
                    <Form.Field error={!!channelIdsError}>
                        <Input
                            name="channelIds"
                            onChange={this.onChange}
                            value={channelIds}
                            placeholder="Channel IDs (Separated by a single space)"
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

const addRolesToChannelsMutation = gql`
    mutation($roleIds: [String!]!, $channelIds: [String!]!) {
        addRolesToChannels(roleIds: $roleIds, channelIds: $channelIds) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(addRolesToChannelsMutation)(observer(AddRolesToChannels));

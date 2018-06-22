import React from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Form, Container, Header, Input, Button, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class CreateChannel extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            name: '',
            locked: undefined,
            roleIds: undefined,
            errors: {},
        });
    }

    onChange = (e) => {
        const { name, value } = e.target;
        this[name] = value;
    };

    onSubmit = async () => {
        const { name, locked, roleIds } = this;

        const lockedReal = locked !== undefined ? locked === 'true' : undefined;
        const roleIdsReal = roleIds !== undefined ? roleIds.split(' ').filter(id => id.length > 0) : undefined;

        let response;

        try {
            response = await this.props.mutate({ variables: { name, locked: lockedReal, roleIds: roleIdsReal } });
        } catch (err) {
            console.log('[BACKEND ERROR - This could be because your submitted data contained incorrect data types] ', err);
            this.props.history.push('/login');
            return;
        }

        console.log(response);

        const { ok, errors, channel } = response.data.createChannel;

        if (ok) {
            this.props.history.push(`/view-chat/${channel.id}`);
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
            locked,
            roleIds,
            errors: { nameError, lockedError, roleIdError },
        } = this;

        const errorList = [];

        if (nameError) errorList.push(nameError);
        if (lockedError) errorList.push(lockedError);
        if (roleIdError) errorList.push(roleIdError);

        const lockedVal = locked === undefined ? '' : locked;
        const roleIdsVal = roleIds === undefined ? '' : roleIds;

        return (
            <Container text>
                <Header as="h2">Create Channel</Header>
                <Form>
                    <Form.Field error={!!nameError}>
                        <Input name="name" onChange={this.onChange} value={name} placeholder="Name" fluid />
                    </Form.Field>
                    <Form.Field error={!!lockedError}>
                        <Input name="locked" onChange={this.onChange} value={lockedVal} placeholder="Private (Optional)" fluid />
                    </Form.Field>
                    <Form.Field error={!!lockedError}>
                        <Input
                            name="roleIds"
                            onChange={this.onChange}
                            value={roleIdsVal}
                            placeholder="Access Role IDs (Optional) (Separated by a single space) (Only affects private channels)"
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

const createChannelMutation = gql`
    mutation($name: String!, $locked: Boolean, $roleIds: [Int!]) {
        createChannel(name: $name, locked: $locked, roleIds: $roleIds) {
            ok
            channel {
                id
            }
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(createChannelMutation)(observer(CreateChannel));

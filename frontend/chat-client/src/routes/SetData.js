import React from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class SetData extends React.Component {
    onSubmit = async () => {
        let response;

        try {
            response = await this.props.mutate();
        } catch (err) {
            console.log('ERROR:', err);
            return;
        }

        console.log(response);

        const { ok, errors } = response.data.setData;

        if (ok) {
            console.log('/login');
        } else {
            const err = {};

            errors.forEach(({ path, message }) => {
                // path is column name
                console.log('found error:', path, '|', message);
                err[`${path}Error`] = message.charAt(0).toUpperCase() + message.slice(1);
            });
        }
    };

    render() {
        return (
            <Container text>
                <Header as="h2">Override Values in Database</Header>
                <Button onClick={this.onSubmit}>Reset Database</Button>
            </Container>
        );
    }
}

const setDataMutation = gql`
    mutation {
        setData {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(setDataMutation)(SetData);

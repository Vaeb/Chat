import React from 'react';
import { Container, Header, Button, Form, Message, TextArea } from 'semantic-ui-react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class RunSequelize extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            text: '',
            errors: {},
            output: '',
        });
    }

    onChange = (e) => {
        const { name, value } = e.target;
        this[name] = value;
    };

    onSubmit = async () => {
        const { text } = this;

        let response;
        console.log(text);

        try {
            response = await this.props.mutate({
                variables: { text },
            });
        } catch (err) {
            console.log('ERROR:', err);
            return;
        }

        console.log(response);

        const { ok, errors, output } = response.data.runSeq;

        if (ok) {
            console.log('ok');
            console.log(output);

            this.errors = {};
            this.output = output;
        } else {
            const err = {};

            errors.forEach(({ path, message }) => {
                // path is column name
                console.log('found error:', path, '|', message);
                err[`${path}Error`] = message.charAt(0).toUpperCase() + message.slice(1);
            });

            this.output = '';
            this.errors = err;
        }
    };

    render() {
        const {
            text,
            output,
            errors: { generalError },
        } = this;

        const errorList = [];

        if (generalError) errorList.push(generalError);

        return (
            <Container text style={{ marginTop: '50px' }}>
                <Header as="h2">Sequelize Query</Header>
                <Form>
                    <Form.Field error={!!generalError}>
                        <TextArea name="text" onChange={this.onChange} value={text} autoHeight placeholder="Code here" />
                    </Form.Field>
                    <Button onClick={this.onSubmit}>Run Code</Button>
                </Form>

                {output.length ? <Message success header="Output" content={output} /> : null}
                {errorList.length ? <Message error header="There were some errors with your submission" list={errorList} /> : null}
            </Container>
        );
    }
}

const runSeqMutation = gql`
    mutation($text: String!) {
        runSeq(text: $text) {
            ok
            errors {
                path
                message
            }
            output
        }
    }
`;

export default graphql(runSeqMutation)(observer(RunSequelize));

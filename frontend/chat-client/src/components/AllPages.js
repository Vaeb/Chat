import React from 'react';
import gql from 'graphql-tag';
import { Subscription } from 'react-apollo';

const heartbeatSubscription = gql`
    subscription {
        heartbeat
    }
`;

// eslint-disable-next-line react/prefer-stateless-function
class AllPages extends React.Component {
    render() {
        return (
            // eslint-disable-next-line
            <Subscription subscription={heartbeatSubscription}>
                {({ data, loading }) => {
                    if (loading) {
                        console.log('Subscription component loading...');
                        return null;
                    }

                    if (!data) {
                        console.log('No data in heartbeat subscription...');
                        return null;
                    }

                    console.log('Received heartbeat with stamp:', new Date(Number(data.heartbeat)));

                    return null;
                }}
            </Subscription>
        );
    }
}

export default AllPages;

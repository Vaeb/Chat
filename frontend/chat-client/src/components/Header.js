import styled from 'styled-components';
import React from 'react';
import { Header } from 'semantic-ui-react';

const HeaderWrapper = styled.div`
    grid-column: 2;
    grid-row: 1;
    background-color: #36393e;
    color: #fff;
    border-width: 0px;
    border-bottom: 1px solid #202225;
    border-bottom-color: hsla(0, 0%, 100%, 0.04);
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
`;

const style = {
    header: {
        marginTop: '12px',
        marginLeft: '10px',
        height: '100%',
    },
};

export default ({ channelName }) => (
    <HeaderWrapper>
        {console.log('Rendering Header')}
        <Header inverted style={style.header}>
            # {channelName}
        </Header>
    </HeaderWrapper>
);

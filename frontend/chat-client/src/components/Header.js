import styled from 'styled-components';
import React from 'react';
import { Header, Divider } from 'semantic-ui-react';

const HeaderWrapper = styled.div`
    grid-column: 2;
    grid-row: 1;
    background-color: #36393e;
    color: #fff;
    border-width: 0px;
    border-bottom-width: 1px;
    border-bottom-color: #202225;
    border-bottom-style: solid;
`;

const style = {
    channelName: {
        marginTop: '0.5em',
        marginLeft: '10px',
        height: '100%',
    },
};

export default ({ channelName }) => (
    <HeaderWrapper>
        <Header inverted style={style.channelName}>
            # {channelName}
        </Header>
    </HeaderWrapper>
);

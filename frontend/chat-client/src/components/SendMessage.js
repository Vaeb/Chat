import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';

// import './SendMessageStyle.css';

const SendMessageWrapper = styled.div`
    grid-column: 2;
    grid-row: 3;
    background-color: #36393e;
    border-width: 0px;
    border-top: 1px solid #eceeef;
    border-top-color: hsla(0, 0%, 100%, 0.04);
`;

/* const InputBox = styled.input`
    padding: 0.5em;
    background-color: transparent;
    color: hsla(0, 0%, 100%, 0.7);
    border: none;
`; */

const UseStyle = () => (
    <style>
        {`
            .input {
                padding: 0.5em;
                border: none;
                height: 100%;
            }

            .input input {
                background-color: hsla(218, 5%, 47%, 0.3) !important;
                color: hsla(0, 0%, 100%, 0.7) !important;
            }

            .input input::selection {
                color: hsla(0, 0%, 100%, 0.3) !important;
            }
        `}
    </style>
);

export default ({ channelName }) => (
    <SendMessageWrapper>
        <UseStyle />
        <Input inverted fluid placeholder={`Message #${channelName}`} />
    </SendMessageWrapper>
);

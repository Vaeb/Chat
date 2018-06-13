import React from 'react';
import styled from 'styled-components';

const InputWrapper = styled.div`
    grid-column: 2;
    grid-row: 3;
    background-color: hsla(218, 5%, 47%, 0.3);
`;

const InputBox = styled.input`
    padding: 0.5em;
    background-color: transparent;
    color: hsla(0, 0%, 100%, 0.7);
    border: none;
`;

export default () => (
    <InputWrapper>
        <InputBox type="text" placeholder="Message chat" />
    </InputWrapper>
);

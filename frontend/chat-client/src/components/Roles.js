import styled from 'styled-components';
import React from 'react';

const RoleWrapper = styled.div`
    grid-column: 3;
    grid-row: 1 / 4;
    background-color: #2f3136;
    color: hsla(0, 0%, 100%, 0.4);
`;

const role = ({ id, name }) => <li key={`role-${id}`}>{name}</li>;

export default ({ roles }) => (
    <RoleWrapper>
        <ul>
            <li>Roles</li>
            {roles.map(role)}
        </ul>
    </RoleWrapper>
);

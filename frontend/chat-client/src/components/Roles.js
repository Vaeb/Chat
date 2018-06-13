import styled from 'styled-components';
import React from 'react';

const RoleWrapper = styled.div`
    grid-column: 3;
    grid-row: 1 / 4;
    background-color: #2f3136;
`;

const RoleList = styled.ul`
    width: 100%;
    padding-left: 0px;
    list-style: none;
`;

const RoleTitle = styled.li`
    height: 40px;
    color: hsla(0, 0%, 100%, 0.7);
    display: flex;
    margin-left: 8px;
    padding-left: 7px;
    font-size: 16px;
`;

const RoleListItem = styled.li`
    height: 40px;
    color: hsla(0, 0%, 100%, 0.4);
    display: flex;
    margin-left: 8px;
    padding-left: 7px;
    align-items: center;
    font-size: 16px;
    &:hover {
        background-color: #36393e;
        color: #fff;
    }
`;

const role = ({ id, name }) => <RoleListItem key={`role-${id}`}>{name}</RoleListItem>;

export default ({ roles }) => (
    <RoleWrapper>
        <RoleList>
            <RoleTitle>Roles</RoleTitle>
            {roles.map(role)}
        </RoleList>
    </RoleWrapper>
);

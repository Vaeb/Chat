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

// const RoleTitle = styled.li`
//     height: 40px;
//     color: hsla(0, 0%, 100%, 0.7);
//     display: flex;
//     margin-left: 8px;
//     padding-left: 7px;
//     font-size: 16px;
// `;

const RoleListItemName = styled.li`
    color: hsla(0, 0%, 100%, 0.4);
    display: flex;
    margin-left: 8px;
    padding-left: 7px;
    align-items: center;
    font-size: 16px;
    margin-top: 25px;
    margin-bottom: 5px;
`;

const RoleListItemUser = styled.li`
    height: 28px;
    color: ${props => props.color};
    display: flex;
    margin-left: 8px;
    padding-left: 21px;
    align-items: center;
    font-size: 14px;
    &:hover {
        background-color: #36393f;
        ${props => props.viewRoleId === 1 && 'color: #fff;'};
    }
`;

const roleUser = ({ id, username, color, viewRoleId }) => (
    <RoleListItemUser viewRoleId={viewRoleId} color={color} key={`role-user-${id}`}>
        {username}
    </RoleListItemUser>
);

const role = ({ id, title, members }) => (
    <React.Fragment key={`role-frag-${id}`}>
        <RoleListItemName key={`role-name-${id}`}>{title}</RoleListItemName>
        {members.map(roleUser)}
    </React.Fragment>
);

const Roles = ({ roles }) => (
    <RoleWrapper>
        <RoleList>
            {/* <RoleTitle>Online</RoleTitle> */}
            {roles.map(role)}
        </RoleList>
    </RoleWrapper>
);

export default Roles;

import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import find from 'lodash/find';

import { withData } from '../context/dataContexts';

const RoleWrapper = styled.div`
    grid-column: 3;
    grid-row: 1 / 4;
    background-color: #2f3136;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
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
    ${props => `
        height: 28px;
        color: ${props.color};
        display: flex;
        margin-left: 8px;
        padding-left: 21px;
        align-items: center;
        font-size: 14px;
        &:hover {
            background-color: #36393f;
            ${props.highestViewRoleId === 1 && 'color: #fff;'};
        }
    `};
`;

const roleUser = ({ id, username, color, highestViewRoleId }) => (
    <RoleListItemUser style={{ cursor: 'pointer' }} highestViewRoleId={highestViewRoleId} color={color} key={`role-user-${id}`}>
        {username}
    </RoleListItemUser>
);

const role = ({ id, name, title, members }, onRoleClick, canAdd, viewUsers) => (
    <React.Fragment key={`role-frag-${id}`}>
        <RoleListItemName key={`role-name-${id}`}>
            {`${title}`}
            {canAdd ? (
                <span>
                    <Icon
                        onClick={() => onRoleClick({ roleId: id, roleName: name })}
                        style={{ marginLeft: '4px', cursor: 'pointer', fontSize: '14px' }}
                        name="add circle"
                    />
                </span>
            ) : null}
        </RoleListItemName>
        {members.map(memberId => roleUser(find(viewUsers, ['id', memberId])))}
    </React.Fragment>
);

const Roles = ({ chatData: { viewRoles, viewUsers }, onRoleClick, canAdd }) => (
    <RoleWrapper>
        {console.log('Rendering Roles')}
        <RoleList>
            {/* <RoleTitle>Online</RoleTitle> */}
            {viewRoles.map(r => role(r, onRoleClick, canAdd, viewUsers))}
        </RoleList>
    </RoleWrapper>
);

export default withData(Roles, ['viewRoles', 'viewUsers']);

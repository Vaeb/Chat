import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

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

const role = ({ id, name, title, members }, onRoleClick, canAdd) => (
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
        {members.map(roleUser)}
    </React.Fragment>
);

const Roles = ({ roles, onRoleClick, canAdd }) => (
    <RoleWrapper>
        <RoleList>
            {/* <RoleTitle>Online</RoleTitle> */}
            {roles.map(r => role(r, onRoleClick, canAdd))}
        </RoleList>
    </RoleWrapper>
);

export default Roles;

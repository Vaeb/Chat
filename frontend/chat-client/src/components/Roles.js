import React from 'react';
import styled from 'styled-components';
import { Icon, Checkbox } from 'semantic-ui-react';
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
    overflow-y: auto;
    overflow-x: hidden;
`;

const RoleList = styled.ul`
    width: 100%;
    padding-left: 0px;
    list-style: none;
    margin-left: 8px;
`;

// const RoleTitle = styled.li`
//     height: 40px;
//     color: hsla(0, 0%, 100%, 0.7);
//     display: flex;
//     margin-left: 8px;
//     padding-left: 7px;
//     font-size: 16px;
// `;

// color: ${props.editRoleUsersView ? 'hsla(0,0%,100%,0.75)' : 'hsla(0, 0%, 100%, 0.4)'};

const RoleListItemName = styled.li`
    color: hsla(0, 0%, 100%, 0.4);
    display: flex;
    padding-left: 7px;
    align-items: center;
    font-size: 16px;
    margin-top: 25px;
    margin-bottom: 5px;
`;

const RoleListItemImg = styled.img`
    border-radius: 50%;
    border-style: none;
    box-sizing: inherit;
    width: 30px
    height: 30px
    margin-right: 10px;
`;

const RoleListItemUserWrapper = styled.li`
    ${props => `
        height: 40px;
        color: ${props.color};
        display: flex;
        padding-left: 7px;
        align-items: center;
        font-size: 14px;
        &:hover {
            background-color: #36393f;
            ${props.highestViewRoleId === 1 ? 'color: #fff;' : ''};
        }
    `};
`;

const RoleListItemUser = styled.div`
    display: flex;
    align-items: center;
`;

const CustomStyle = () => (
    <style>
        {`
            .ui.toggle.checkbox .box:before, div.ui.toggle.checkbox label:before {
                background-color: rgba(0,0,0,.5);
            }

            .ui.toggle.checkbox input:focus~.box:before, div.ui.toggle.checkbox input:focus~label:before {
                background-color: rgba(0,0,0,.5);
            }

            .ui.toggle.checkbox .box:hover::before, div.ui.toggle.checkbox label:hover::before {
                background-color: rgba(0,0,0,.5);
            }

            .ui.toggle.checkbox input:focus:checked~.box:before, div.ui.toggle.checkbox input:focus:checked~label:before {
                background-color: #2185d0 !important;
            }

            li.roleListItemUserClassWrapper {
                cursor: pointer;
            }

            div.roleListItemUserClass {
                cursor: pointer;
            }
        `}
    </style>
);

const styles = {
    Checkbox: {
        position: 'absolute',
        right: '2px',
        transform: 'rotate(90deg)',
        // top: '17px',
        // marginTop: '25px',
        marginTop: '5px',
    },
};

const roleUser = ({ id, username, color, highestViewRoleId }, { roleId }, editRoleUsers, onUserRoleClick) => (
    <RoleListItemUserWrapper
        className="roleListItemUserClassWrapper"
        highestViewRoleId={highestViewRoleId}
        color={color}
        key={`role-user-${id}`}
    >
        <RoleListItemUser className="roleListItemUserClass">
            <RoleListItemImg src="/avatar4.jpg" />
            {username}
            {editRoleUsers && roleId !== 1 ? (
                <span>
                    <Icon
                        onClick={() => onUserRoleClick({ roleId, userId: id })}
                        style={{ marginLeft: '4px', cursor: 'pointer', fontSize: '14px', color: 'hsla(0,0%,100%,0.2)' }}
                        name="minus circle"
                    />
                </span>
            ) : null}
        </RoleListItemUser>
    </RoleListItemUserWrapper>
);

const role = ({
    id, name, title, members, position, color,
}, onRoleClick, editRoleUsers, viewUsers, highestRolePos, onUserRoleClick) => {
    members = members.map(mId => find(viewUsers, ['id', mId]));
    members.sort((a, b) => b.position - a.position);

    return (
        <React.Fragment key={`role-frag-${id}`}>
            <RoleListItemName key={`role-name-${id}`}>
                {editRoleUsers ? (
                    <span
                        style={{
                            marginRight: '4px',
                            fontSize: '14px',
                            color: editRoleUsers && color !== '#B9BBBE' ? color : 'hsla(0, 0%, 100%, 0.4)',
                        }}
                    >
                        •
                    </span>
                ) : null}
                {`${title}`}
                {editRoleUsers && id !== 1 && position < highestRolePos ? (
                    <span>
                        <Icon
                            onClick={() => onRoleClick({ roleId: id, roleName: name })}
                            style={{
                                marginLeft: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                            name="add circle"
                        />
                    </span>
                ) : null}
            </RoleListItemName>
            {members.map(member => roleUser(member, { roleId: id }, editRoleUsers && position < highestRolePos, onUserRoleClick))}
        </React.Fragment>
    );
};

const Roles = ({
    chatData: { viewRoles, viewUsers, nowUser }, canAdd, editRoleUsers, onRoleClick, onEditClick, onUserRoleClick,
}) => (
    <RoleWrapper>
        <CustomStyle />
        {console.log('Rendering Roles')}
        <RoleList>
            {/* <RoleTitle>Online</RoleTitle> */}
            {canAdd ? <Checkbox style={styles.Checkbox} onChange={(e, { checked }) => onEditClick(checked)} toggle /> : null}
            {viewRoles.map(r => role(r, onRoleClick, editRoleUsers, viewUsers, nowUser.position, onUserRoleClick))}
        </RoleList>
    </RoleWrapper>
);

export default withData(Roles, ['viewRoles', 'viewUsers', 'nowUser']);

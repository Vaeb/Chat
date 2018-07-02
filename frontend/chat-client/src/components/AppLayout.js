import styled from 'styled-components';

const AppLayoutDiv = styled.div`
    ${props => `
        display: grid;
        position: fixed;
        height: 100%;
        width: 100vw;
        grid-template-columns: ${!props.isSmall ? '250px 1fr 250px' : '13% 1fr'};
        grid-template-rows: ${!props.isSmall ? '50px calc(100% - 120px) 70px' : '50px calc(100% - 120px) 70px'};
        background-color: #2f3136;
    `};
`;

export default AppLayoutDiv;

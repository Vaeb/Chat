import styled from 'styled-components';

const AppLayoutDiv = styled.div`
    ${props => `
        position: fixed;
        display: grid;
        height: 100vh;
        width: 100vw;
        grid-template-columns: ${!props.isSmall ? '250px 1fr 250px' : '12% 1fr'};
        grid-template-rows: ${!props.isSmall ? '50px 1fr 70px' : '50px 1fr 70px'};
        background-color: #2f3136;
    `};
`;

export default AppLayoutDiv;

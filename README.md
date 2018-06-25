# Vashtalk

React-based chat project for Vashta.

## Setup

1.  Navigate to `backend/` and install modules: `npm install` (or `npm install --force` for fresh installation)
1.  Navigate to `frontend/chat-client/` and install modules: `npm install`(or `npm install --force` for fresh installation)
1.  Install nodemon module: `npm i -g nodemon`
1.  Install PostgreSQL
    -   Windows:
        -   Install 9.6: https://www.postgresql.org/download/windows/
        -   Set root postgres user password to 1248 in setup (or set new pass in models/index.js)
    -   Ubuntu:
        -   `sudo apt-get update`
        -   `sudo apt-get install postgresql postgresql-contrib`
        -   Login as postgres user: `sudo -i -u postgres`
        -   Set the password to 1248: `\password`
1.  Add "psql" to Windows PATH
    -   Windows:
        -   Add C:\Program Files\PostgreSQL\9.6\bin to PATH
        -   Add C:\Program Files\PostgreSQL\9.6\lib to PATH
        -   Restart terminal(s)
1.  Connect to postgres: `psql -U postgres`
1.  Create chat database: `create database chat;`
1.  Exit database: `\q`
1.  Navigate into `backend/`
1.  Compile the code with babel: `npm run build`
1.  Start the backend nodemon server: `npm run serve`
1.  Using another terminal if necessary, navigate into `frontend/chat-client/`
1.  Start the frontend nodemon server: `npm start`

## PostgreSQL Key Commands

-   `psql -U postgres`: Connect to postgres
-   `\c chat`: Connect to `chat` database
-   `\d`: List tables
-   `\d table_name`: Describe table `table_name`
-   `\q`: Quit postgres

## Recommended VSCode Extensions

-   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    -   No setup needed (.eslintrc.js already exists in `frontend/chat-client/` and `backend/`)
    -   Necessary NPM modules will have been installed upon `npm install` or `yarn install` in both `frontend/chat-client/` and `backend/`
-   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    -   Add the following to your VSCode User Settings:
        ```
        "prettier.singleQuote": true,
        "prettier.tabWidth": 4,
        "prettier.trailingComma": "es5",
        "prettier.eslintIntegration": true,
        "editor.formatOnSave": true,
        "prettier.printWidth": 140,
        "prettier.proseWrap": "preserve"
        ```

## Useful Links

-   [Node (Includes NPM)](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com/lang/en/docs/install/)
-   [Chat (Vashta Server)](https://chat.vashta.io/view-chat) + [Chat (Local)](http://localhost:3000/view-chat)
-   [GraphQL Testing (Vashta Server)](https://chat.vashta.io/graphiql) + [GraphQL Testing (Local)](http://localhost:8080/graphiql)
-   [Apollo GraphQL Docs](https://www.apollographql.com/docs/react/essentials/get-started.html) + [Apollo GraphQL Docs (2.0 Migration)](https://www.apollographql.com/docs/react/recipes/2.0-migration.html)
-   [Sequelize Docs](http://docs.sequelizejs.com/manual/installation/getting-started.html)
-   [MobX Docs](https://github.com/mobxjs/mobx) + [MobX React Docs](https://github.com/mobxjs/mobx-react)
-   [React Tutorial](https://reactjs.org/tutorial/tutorial.html)
-   [React Component Lifecycle Docs](https://reactjs.org/docs/react-component.html)
-   [React Router Docs](https://reacttraining.com/react-router/web/example/auth-workflow)
-   [React Semantic UI Docs](https://react.semantic-ui.com/elements/button)
-   [React Styled Components Docs](https://www.styled-components.com/docs/basics)
-   [Lodash](https://lodash.com/docs/)

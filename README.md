# Vashtalk

React-based chat project for Vashta.

## Setup

1. `npm install`
2. Install nodemon module: `npm i -g nodemon`
3. Install PostgreSQL
   - Windows:
     - Install 9.6: https://www.postgresql.org/download/windows/ 
     - Set root postgres user password to 1248 in setup (or set new pass in models/index.js)
   - Ubuntu:
     - `sudo apt-get update`
     - `sudo apt-get install postgresql postgresql-contrib`
     - Login as postgres user: `sudo -i -u postgres`
     - Set the password to 1248: `\password`
4. Add "psql" to Windows PATH
   - Windows:
     - Add C:\Program Files\PostgreSQL\9.6\bin to PATH
     - Add C:\Program Files\PostgreSQL\9.6\lib to PATH
     - Restart terminal
5. Connect to postgres: `psql -U postgres`
6. Create chat database: `create database chat;`
7. Exit database: `\q`
8. Start the nodemon server: `npm start`

## PostgreSQL Key Commands

- `psql -U postgres`: Connect to postgres
- `\c chat`: Connect to `chat` database
- `\d`: List tables
- `\d table_name`: Describe table `table_name`
- `\q`: Quit postgres
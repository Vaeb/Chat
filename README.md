# Vashtalk

Setup:

1) npm install
2) Install nodemon module: npm i -g nodemon
3) Install PostgreSQL
   [Windows]:
   a) Install 9.6: https://www.postgresql.org/download/windows/ 
   b) Set root postgres user password to 1248 in setup (or set new pass in models/index.js)
   [Ubuntu]:
   a) sudo apt-get update
   b) sudo apt-get install postgresql postgresql-contrib
   c) Login as postgres user: sudo -i -u postgres
   d) Set the password to 1248: \password
4) Add "psql" to Windows PATH
   [Windows]:
   a) Add C:\Program Files\PostgreSQL\9.6\bin to PATH
   b) Add C:\Program Files\PostgreSQL\9.6\lib to PATH
   c) Restart terminal
5) Connect to postgres: psql -U postgres
6) Create chat database: create database chat;
7) Exit database: \q
8) Start the nodemon server: npm start
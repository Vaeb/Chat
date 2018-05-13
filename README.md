# Vashtalk

Setup:

1) npm install
2) Install nodemon module: npm i -g nodemon
3) Install PostgreSQL
4) Set root postgres user password to 1248 (or set new pass in models/index.js)
5) Make sure "psql" is in PATH (accessible from command line)
6) Connect to postgres: psql -U postgres
7) Create chat database: create database chat;
8) Exit database: \q
9) Start the nodemon server: npm start
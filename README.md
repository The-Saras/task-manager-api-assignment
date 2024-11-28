# Task Management API

## Project overview

- This api is built using Typescript, Nodejs, Express used JWT for authentication.
- Postgress is the database and Prisma is the orm used in this.
- For input validation I have used ZOD library.

## Setup Instructions 
- Clone the repository locally
  
  ```
  git clone https://github.com/The-Saras/task-manager-api-assignment

- Go to the directory
- Install all the modules and dependencies

  ```
  npm install

- Create .env file and copy env Variables
- Setup postgres database and add URL to env variables
- Run the following commands to start server
  ```
  tsc
  node dist/index.js
- Seed the database with Sample users
  ```
  tsc
  node dist/seed.js
- Server will be up and running on PORT 3000
- To actually test all the endpoints, import **Task Manager API's.postman_collection.json** file in Postman it contains every single request
  

# NodeJS_Mentoring_Program

## Project Structure

```bash
    .
    ├── src                       - store source files of the project
    │   └── utils
    │       ├── csv.serve.ts
    │       └── string.reverse.ts
    ├── temp                     - temporary folder which is used for csv conversion
    │   ├── csv                  -  from [./temp/csv]
    │   └── csv-parsed           -  to [./temp/csv-parsed]
    ├── test                     - the folder for testing purpose
    │   └── data
    │       └── csv.serve.data.csv
    ├── build                    - stores the output of the TypeScript compilation with [tsc]
    ├── lib                      - stores the output of the TypeScript compilation with [babel]
    ├── package-lock.json
    └── tsconfig.json
    ├── package.json
    ├── README.md
```

### Scripts

| Script name     | Command                                                                  | Description                                                                                       |
|-----------------|--------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| postinstall     | `npm run tsc && npm run babel:tsc`                                       | Compile js-representation files with TypeScript & Babel(TypeScript plugin)                        |
| tsc             | `tsc`                                                                    | Compile js-representation files with TypeScript and put them into **./build** folder              |
| babel:tsc       | `babel  --extensions \".ts\" ./src --out-dir ./lib`                      | Compile js-representation files with Babel(TypeScript plugin)  and put them into **./lib** folder |
| task1           | `nodemon --config ./nodemon.dev.json ./src/utils/string.reverse.ts`      | Run the solution for Task 1                                                                       |
| task2           | `npm run task2:stream`                                                   | Run the solution for Task 2                                                                       |
| task2:stream    | `nodemon --config ./nodemon.dev.json ./src/utils/csv.serve.stream.ts`    | Run the solution for Task 2 with usage stream approach                                            |
| task2:no_stream | `nodemon --config ./nodemon.dev.json ./src/utils/csv.serve.no_stream.ts` | Run the solution for Task 2 with usage regular usage of readFile and appendFile functions         |
| task3.1:babel   | `nodemon ./lib/utils/string.reverse.js`                                  | Run the solution for Task 3.1                                                                     |
| task3.2:babel   | `nodemon ./lib/utils/csv.serve.stream.js`                                | Run the solution for Task 3.2                                                                     |
| start:dev       | `nodemon ./src/app.ts`                                                   | Run the solution for the Module_2: ExpressJS server                                               |

### Service API (PATH=/api/v1)

[x-access-token] all endpoints required, except **/api/v1/login** and **/**

| VERB | Route | Description                    |
|------|-------|--------------------------------|
| GET  | /     | Return message: "Hello World!" |

#### User API (PATH=/api/v1/user)

| VERB       | Route | Description                                                     |
|------------|-------|-----------------------------------------------------------------|
| **POST**   | /     | Create User                                                     |
| **GET**    | /list | Get list of all users (or filter by query params)               |
| **GET**    | /:id  | Get User by ID                                                  |
| **PUT**    | /:id  | Update user by parameter ID                                     |
| **DELETE** | /:id  | Delete user by parameter ID (use query params to soft deletion) |

#### User API (PATH=/api/v1/group)

| VERB       | Route | Description                                                    |
|------------|-------|----------------------------------------------------------------|
| **POST**   | /     | Create a Group                                                 |
| **GET**    | /list | Get list of all groups (or filter by query params)             |
| **GET**    | /:id  | Get Group by ID                                                |
| **PUT**    | /:id  | Update a group by parameter ID                                 |
| **DELETE** | /:id  | Delete group by parameter ID (only hard deletion is supported) |
| **POST**   | /user | Add a user to groups                                           |

#### User API (PATH=/api/v1/login)

| VERB     | Route | Description                                              |
|----------|-------|----------------------------------------------------------|
| **POST** | /     | Create provide token based on sent username and password |

N.B. More details in Swagger (OpenAPI) file will be added later.

## Environment variables

|                         | Default value | Description                                                                                              |
|-------------------------|---------------|----------------------------------------------------------------------------------------------------------|
| **SERVICE_ENV**         | dev           | Environment on each service is run                                                                       |
| **JWT_SECRET**          | unspecified   | JsonWebToken secret text to generate token                                                               |
| **JWT_EXPIRATION_TERM** | 600           | Time term for the token                                                                                  |
| **JWT_PRIVATE_KEY**     | unspecified   | Unsupported currently. However it is allocated for the future implementation to store path to secret key |
| **DB_USER**             | unspecified   | Database username                                                                                        |
| **DB_PASSWORD**         | unspecified   | Database password                                                                                        |
| **DB_NAME**             | unspecified   | Database name                                                                                            |
| **DB_HOST**             | unspecified   | Database hostname                                                                                        |
| **DB_PORT**             | unspecified   | Database port number                                                                                     |
| **KABOOM**              | unspecified   | Time term in ms when unexpected Error will throw any where in code to check safe exit from service       |

## Task Completion

### Module-7: UNIT TESTS AND CONFIG

**Task 1:**

- Add unit tests for User entity controller methods using [Jest library](https://jestjs.io/).
- Add unit tests for Group entity controller methods using Jest.

**Task 2:**

- The information on DB connection (connection string) should be stored in .env file and should be passed to the application using environment variables with the help of [dotenv package](https://www.npmjs.com/package/dotenv). As an alternative package you can also use [config](https://www.npmjs.com/package/config).

### Module-6: JWT AUTHORIZATION AND CORS

**Task 1:**

- Add authorization to the already existing REST service.
- Add login(username, password)method which should return JWT token.
- Add a middleware which will proxy all the requests (except login) and check that HTTP Authorization header has the correct value of JWT token.
- In case of the HTTP Authorization header is absent in the request, the middleware should stop further controller method execution and return HTTP 401 code (Unauthorized Error) and standard error message.
- In case of HTTPAuthorization header has invalid JWT token in the request, the middleware should return HTTP code 403 (Forbidden Error) and standard error message.

**Task 2:**

-Add CORS middleware to access service methods from WEB applications hosted on another domains [Express Cors middleware](https://github.com/expressjs/cors).

### Module-5: LOGGING & ERROR HANDLING

**Task 1:**

- Add express middleware which will log which service method has been invoked and which arguments have been passed to it.

**Task 2:**

- Add express middleware which will log all unhandled errors and return a standard message with HTTP code 500(Internal Server Error).
**Remark:** Do not modify the status code and the message for other errors like validation errors from the previous task.
- Add error handling to process.on ("uncaughtException",...).
- Add Unhandled promise rejection listener to log errors.

**Task 3:**

- Every method in the controllers should log the errors which should include the following information:
  - method name;
  - arguments which have been passed to the method;
  - error message.

### Module-4: SECOND ENTITY AND MANY-TO-MANY ENTITY RELATIONSHIPS

**Task 1:**

- Add Group entity to already existing REST service with CRUD operations;
- TheGroup entity should have the following properties (you can use UUID as Group id):

```typescript
export type TPermission = "READ" | "WRITE" | "DELETE" | "SHARE" | "UPLOAD_FILES";

export type TGroup = {
    id: string;
    name: string;
    permissions: TPermission[];
};
```

- The service should provide the following CRUD operations for Group:
  - Get group by id;
  - Get all groups;
  - Create and update a group;
  - Remove group (hard delete–group data is fully removed from the DB);
- Storing of groups data should be done in PostgreSQLinGroups table;
- The service should follow the principles of 3-layer architecture.

**Task 2:**

- Link User records in one table with Group records in another table.
- Add a UserGroup table ("many-to-many" relationship) which will store the data describing which users are assigned to which group.
- If any record gets removed from the DB, then all linked records should be removed from UserGroup as well.

**Task 3:**

- Add addUsersToGroup(groupId, userIds) method which will allow adding users to a certain group.
- Use transactions to save records in DB.

### Module-3: PostgreSQL and layered architecture

#### Project structure example from a lecture (based on the Layered architecture approach)

```bash
   src                          - store source files of the project
    ├── app.js                  - The application entry point
    ├── api/                    - Express route controllers for all the endpoints of the application
    ├── config/                 - Environment variables and configuration related stuff
    ├── loaders/                - Split the startup process into modules
    ├── models/                 - Database models
    ├── services/               - All the business logic here
    ├── subscribes/             - Event handlers for async tasks
    ├── types/                  - Type declaration files (d.ts) for TypeScript
```

**Task 1:**

- Install DB PostgreSQL on your machine or use a free web hosting services for PostgreSQL ([Heroku](https://www.heroku.com/postgresor) [ElephantSQL](https://www.elephantsql.com/plans.html)).
- Write> SQL script which will create Users table in the DB and fill it in with predefined users’ collection.
- Configure your REST service to work with PostgreSQL.
- Use the sequelize package [SequelizeJS](http://docs.sequelizejs.com/) as ORM to work with PostgreSQL.
- As an alternative to sequelize you can use more low-level query-builder library [KnexJS](<http://knexjs.org/>).

**Task 2:**

- The service should adhere to 3-layer architecture principles [Ideal NodeJS Project Structure](https://softwareontheroad.com/ideal-nodejs-project-structure/) and contain the following set of directories:

```bash
    ...
    ├── routers/controllers
    ├── services/
    ├── data-access/
    ├── models/
    ...
```

### Module-2: In-memory CRUD REST service with validation

1. Write a simple REST service with CRUD operations for User entity.

- To create REST service,use ExpressJS [ExpressJS](https://expressjs.com/).
- The User should have the following properties (you can use UUID as a user identifier (id)):

 ```typescript
     type User = {
        id: string;
        login: string;
        password: string;
        age: number;
        isDeleted: boolean;  
    }
 ```

**Service should have the following CRUD operations for User:**

- get user by id;
- create and update user;
- get auto-suggest list from limit users, sorted by login property and filtered by loginSubstringin the login property: getAutoSuggestUsers(loginSubstring, limit)
- remove user (soft delete–user gets marked with isDeleted flag, but not removed from the collection).
- Store user’s collection in the service memory (while the service is running).To test the service CRUD methods,you can use [Postman](https://www.getpostman.com/).

2. Add server-side validation for create/update operations of User entity:

- all fields are required;
- login validation is required;
- password must contain letters and numbers;
- user’s age must be between 4 and 130.
- In case of any property does not meet the validation requirements or the field is absent, return 400 (Bad Request) and detailed error message.
- For requests validation use special packages like [joi](<<https://github.com/hapijs/joi>) or [Express-joi-validation](https://www.npmjs.com/package/express-joi-validation).

### Module-1: Basics

1. Write a program which reads a string from the standard input stdin, reverses it and then writes it to the standard output stdout.

- The program should be started from npm script via nodemon(i.e. npm run task1).
- The program should be running in a stand-by mode and should not be terminated after the first-string processing

2. Write a program which should do the following:

- Read the content of csv file from ./csv directory. [Example:](https://epa.ms/nodejs19-hw1-ex1)

```bash
    Book,Author,Amount,Price
    The Compound Effect,Darren Hardy,5,9.48
    The 7 Habits of Highly Effective People,Stephen R. Covey,4,23.48
    The Miracle Morning,Hal Elrod,10,21.34
    Influence: The Psychology of Persuasion,Robert B. Cialdini,4,12.99
    The ONE Thing,Gary Keller,1,11.18
```

- Use the [csvtojson package](https://github.com/Keyang/node-csvtojson) to convert csv file to json object.
- Write the csv file content to a new txt file. Use the following format: [Example](https://epa.ms/nodejs19-hw1-ex2)

```json
    {"book":"The Compound Effect","author":"Darren Hardy","price":9.48}
    {"book":"The 7 Habits of Highly Effective People","author":"Stephen R. Covey","price":23.48}
    {"book":"The Miracle Morning","author":"Hal Elrod","price":21.34}
    {"book":"Influence: The Psychology of Persuasion","author":"Robert B. Cialdini","price":12.99}
    {"book":"The ONE Thing","author":"Gary Keller","price":11.18}
```

- Do not load all the content of the csv file into RAM via stream (read/write file content line by line).
- In case of read/write errors, log them in the console.
- The program should be started via npm script using nodemon(i.e. npm run task2).

3. Rewrite the above-mentioned programs to use [babel](https://babeljs.io/) and ES6 modules.

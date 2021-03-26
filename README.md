# NodeJS_Mentoring_Program

## Task Completion

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
| start:dev       | `nodemon ./index.ts`                                                     | Run the solution for the Module_2: ExpessJS server                                                |

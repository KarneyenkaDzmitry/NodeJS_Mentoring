# NodeJS_Mentoring_Program

## Task Completion

### Basics

1. Write a program which reads a string from the standard input stdin, reverses it and then writes it to the standard output stdout.

- The program should be started from npm script via nodemon(i.e. npm run task1).
- The program should be running in a stand-by mode and should not be terminated after the first-stringprocessing

2. Write a program which should do the following:

- Read the content of csv file from ./csv directory.  [Example:](https://epa.ms/nodejs19-hw1-ex1)

    ```
    Book,Author,Amount,Price
    The Compound Effect,Darren Hardy,5,9.48
    The 7 Habits of Highly Effective People,Stephen R. Covey,4,23.48
    The Miracle Morning,Hal Elrod,10,21.34
    Influence: The Psychology of Persuasion,Robert B. Cialdini,4,12.99
    The ONE Thing,Gary Keller,1,11.18
    ```

- Use the [csvtojson package](https://github.com/Keyang/node-csvtojson) to convert csv file to json object.
- Write the csv file content to a new txt file.Use the following format: [Example](https://epa.ms/nodejs19-hw1-ex2)

    ```json
    {"book":"The Compound Effect","author":"Darren Hardy","price":9.48}
    {"book":"The 7 Habits of Highly Effective People","author":"Stephen R. Covey","price":23.48}
    {"book":"The Miracle Morning","author":"Hal Elrod","price":21.34}
    {"book":"Influence: The Psychology of Persuasion","author":"Robert B. Cialdini","price":12.99}
    {"book":"The ONE Thing","author":"Gary Keller","price":11.18}
    ```

- Do not load all the content of the csvfile into RAM via stream (read/write file content line by line).
- In case of read/write errors, log them in the console.
- The program should be started via npm scriptusing nodemon(i.e. npm run task2).

3. TASK 1.3Rewrite the above-mentionedprograms to use [babel](https://babeljs.io/)and ES6 modules.

## Project Structure

    ```bash
    .
    ├── src                       - store source files of the project
    │   └── utils
    │       ├── csv.serve.ts
    │       └── string.reverse.ts
    ├── temp                     - temporary folder which is used for csv convertation
    │   ├── csv                  -  from [./temp/csv]
    │   └── csv-parsed           -  to [./temp/csv-parsed]
    ├── test                     - the folder for testing porpose
    │   └── data
    │       └── csv.serve.data.csv
    ├── build                    - stores the output of the TypeScript compolation with [tsc]
    ├── lib                      - stores the output of the TypeScript compolation with [babel]
    ├── package-lock.json
    └── tsconfig.json
    ├── package.json
    ├── README.md
    ```

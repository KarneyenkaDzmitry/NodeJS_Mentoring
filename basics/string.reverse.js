const readline = require('readline');

const liner = readline.createInterface({
    input: process.stdin
});

liner.on('line', (line) => {
    console.log([...line].reverse().reduce((accum, next) => accum += next));
})
import { Interface, createInterface } from 'readline';

const liner: Interface = createInterface({
    input: process.stdin
});

liner.on('line', (line: string) => {
    console.log([...line].reverse().reduce((accum: string, next: string) => accum += next));
})
import { Interface, createInterface } from "readline";

const liner: Interface = createInterface({
    input: process.stdin,
});

liner.on("line", (line: string): void => {
    console.log([...line].reverse().join());
});

import { access, mkdir, readdir, rm } from "fs/promises";
import { createReadStream, createWriteStream, constants } from "fs";
import { join, resolve, basename } from "path";
import csvtojson from "csvtojson/v2";

const CSV_WORK_DIR = process.env.CSV_WORK_DIR || join(resolve("."), "temp", "csv");
const CSV_DEST_DIR = process.env.CSV_DEST_DIR || join(resolve("."), "temp", "csv-parsed");
console.debug(`Working Directory:\t[${CSV_WORK_DIR}]`);
console.debug(`Target Directory:\t[${CSV_DEST_DIR}]`);

async function main() {
    await validatePath(CSV_WORK_DIR);
    await validatePath(CSV_DEST_DIR);
    const list = await getListCSVFiles(CSV_WORK_DIR);
    list.forEach(async (filename: string) => {
        try {
            const filepathR = join(CSV_WORK_DIR, filename);
            const filepathD = join(CSV_DEST_DIR, basename(filename) + '.txt');
            const readStream = createReadStream(filepathR);
            const writeStream = createWriteStream(filepathD);
            const csv = csvtojson({ output: "json", noheader: false });
            readStream.pipe(csv).pipe(writeStream);
            csv.on("data", (data) => console.log(`Data Line: [${data}]`));
            await rm(filepathR);
        } catch (error) {
            console.error("Oops...Something went wrong!");
            console.error(error.message);
        }
    });
}

async function getListCSVFiles(path: string): Promise<any> {
    try {
        let names = await readdir(path);
        names = names.filter((name: string) => name.endsWith("csv"));
        return names;
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
        return [];
    }
}

async function validatePath(path: string): Promise<void> {
    try {
        await access(path, constants.F_OK);
        console.info(`[${path}] is accessible.`);
    } catch {
        console.info(`[${path}] is not accessible.`);
        await mkdir(path);
        console.debug(`[${path}] has been just created.`);
    }
}

main();

import { access, mkdir, readdir, rm, readFile, appendFile } from "fs/promises";
import { constants } from "fs";
import { join, resolve, basename } from "path";
import csvtojson from "csvtojson/v2";

const CSV_WORK_DIR = process.env.CSV_WORK_DIR || join(resolve("."), "temp", "csv");
const CSV_DEST_DIR = process.env.CSV_DEST_DIR || join(resolve("."), "temp", "csv-parsed");
console.debug(`Working Directory:\t[${CSV_WORK_DIR}]`);
console.debug(`Target Directory:\t[${CSV_DEST_DIR}]`);

async function main(): Promise<void> {
    await validatePath(CSV_WORK_DIR);
    await validatePath(CSV_DEST_DIR);
    const list = await getListCSVFiles(CSV_WORK_DIR);
    list.forEach(async (filename: string) => {
        try {
            const filepathR = join(CSV_WORK_DIR, filename);
            const filepathD = join(CSV_DEST_DIR, basename(filename) + ".txt");
            try {
                await access(filepathD, constants.F_OK);
            } catch {
                rm(filepathD);
            }

            const csvString = await readFile(filepathR);
            csvtojson({ output: "line" })
                .fromString(csvString.toString("utf8"))
                .subscribe(async (csvLine) => {
                    console.log(`Data Line: [${csvLine}]`);
                    await appendFile(filepathD, `${csvLine}\n`, "utf8");
                });
            await rm(filepathR);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Oops...Something went wrong!");
            console.error(error.message);
        }
    });
}

async function getListCSVFiles(path: string): Promise<string[]> {
    try {
        let names = await readdir(path);
        names = names.filter((name: string) => name.endsWith("csv"));
        return names;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
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

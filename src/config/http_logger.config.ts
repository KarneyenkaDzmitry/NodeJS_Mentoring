import morgan from "morgan";
import { join } from "path";
import * as rfs from "rotating-file-stream";

const httpLogStream = rfs.createStream("http.log", {
    interval: "1d",
    path: join(".", "logs"),
    size: "10M",
    compress: "gzip",
});

morgan.token("timestamp", () => {
    return new Date().toString();
});

const income = morgan("[REQ] :timestamp :method :url", { immediate: true, stream: httpLogStream });
const outcome = morgan("[RES] :timestamp :status :response-time[digits] ms", { stream: httpLogStream });

export const http_loggers = [income, outcome];

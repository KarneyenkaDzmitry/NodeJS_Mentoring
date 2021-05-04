import * as winston from "winston";
import * as express_winston from "express-winston";
import DailyRotateFile from "winston-daily-rotate-file";

const full_log = express_winston.logger({
    transports: [
        new DailyRotateFile({
            filename: "logs/application-%DATE%.log",
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "14d",
        }),
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
});

const error_log = express_winston.errorLogger({
    transports: [
        new DailyRotateFile({
            filename: "logs/application-%DATE%.error.log",
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "10m",
            maxFiles: "14d",
        }),
    ],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
});

export const winstonLoggers = [full_log, error_log];

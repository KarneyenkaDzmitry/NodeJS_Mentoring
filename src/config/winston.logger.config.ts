import * as winston from "winston";
import * as express_winston from "express-winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { Logger, format } from "winston";
const { printf, combine, label, timestamp, prettyPrint } = format;
import { ServiceError } from "../models/errors/error.models";

declare type TInfo = {
    level: string;
    timestamp: string;
    label: string;
    error: ServiceError;
};

const myFormat = printf(({ level, timestamp, label, code, name }): string => {
    return `${timestamp} [${level.padEnd(5, " ")}] [${label}]: ${name} ${code}`;
});

const console = new winston.transports.Console({
    format: combine(
        label({ label: "HTTP-SERVER" }),
        timestamp({
            format: "HH:mm:ss",
        }),
        myFormat,
    ),
    level: "debug",
});

const application_full = new DailyRotateFile({
    filename: "logs/application-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "10m",
    maxFiles: "1d",
    level: "debug",
});

const application_error = new DailyRotateFile({
    filename: "logs/application-%DATE%.error.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "10m",
    maxFiles: "1d",
    level: "error",
});

export function getServiceLogger(serviceName: string): Logger {
    return winston.createLogger({
        defaultMeta: { service: serviceName },
        transports: [application_full, application_error, console],
        format: winston.format.combine(winston.format.colorize(), winston.format.json()),
    });
}

export const full_log = express_winston.logger({
    transports: [application_full],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
});

export const error_log = express_winston.errorLogger({
    transports: [application_error],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
});

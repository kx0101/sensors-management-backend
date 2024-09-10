import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

type LoggerMessage = {
    level: string;
    message: string;
    timestamp?: Date,
}

const myFormat = printf(({ level, message, timestamp }: LoggerMessage) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const logger = createLogger({
    format: combine(
        timestamp({
            format: `DD-MM-YYYY-HH:mm:ss`
        }),
        myFormat,
        colorize({
            all: true
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename: 'error.log',
            level: 'error',
            format: format.uncolorize()
        }),
    ]
});

import path from "path";
import { format, createLogger, transports } from "winston";
import expressWinston from "express-winston";

/**
 * Configure the default logger
 */
const logFormat = format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`);
const logger = createLogger({
    level: process.env.NODE_ENV === "production" ? 'info' : 'debug',
    format: format.combine(
        format.label({ label: path.basename(require.main.filename) }),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                logFormat
            )
        })
    ]
});

export default logger
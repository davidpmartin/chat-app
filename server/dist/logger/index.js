"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
/**
 * Configure the default logger
 */
const logFormat = winston_1.format.printf(info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`);
const logger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === "production" ? 'info' : 'debug',
    format: winston_1.format.combine(winston_1.format.label({ label: path_1.default.basename(require.main.filename) }), winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })),
    transports: [
        new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.colorize(), logFormat)
        })
    ]
});
exports.default = logger;
//# sourceMappingURL=index.js.map
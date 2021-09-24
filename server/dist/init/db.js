"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../logger"));
function default_1() {
    logger_1.default.debug("connecting to db...");
    mongoose_1.default.connect('mongodb://localhost:27017/chat_dev', err => {
        if (err) {
            logger_1.default.debug("db connection failed.");
            logger_1.default.error(err);
        }
        logger_1.default.info("db connection established.");
    });
}
exports.default = default_1;
//# sourceMappingURL=db.js.map
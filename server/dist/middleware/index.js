"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secured = void 0;
const logger_1 = __importDefault(require("../logger"));
/**
 * Middleware function to control route access
 */
const secured = (req, res, next) => {
    const result = req.user != undefined;
    logger_1.default.debug(`Access allowed: ${result}`);
    if (result) {
        return next();
    }
    return res.sendStatus(401);
};
exports.secured = secured;
//# sourceMappingURL=index.js.map
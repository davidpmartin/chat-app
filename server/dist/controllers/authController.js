"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.getAuthStatus = void 0;
const passport_1 = __importDefault(require("passport"));
const logger_1 = __importDefault(require("../logger"));
/**
 * /login
 * @method GET
 * @description Allows clients to verify authentication status
 * @returns { 200 === authenticated, 401 === unauthenticated }
 */
function getAuthStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("GET /login");
        // Check authentication status
        if (req.isAuthenticated()) {
            logger_1.default.debug(`advising client user is authenticated`);
            return res.sendStatus(200);
        }
        else {
            logger_1.default.debug(`advising client user is not authenticated`);
            return res.sendStatus(401);
        }
    });
}
exports.getAuthStatus = getAuthStatus;
/**
 * /login
 * @method POST
 * @description Allows clients to request authentication by providing a username and password
 * @returns { user === success, 404 === fail }
 */
function loginUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("POST /login");
        // Run the authencate method
        passport_1.default.authenticate('local', (err, user, info) => {
            logger_1.default.debug(`passport.auth() callback`);
            // ERROR
            if (err) {
                logger_1.default.debug(`Auth error: ${info}`);
                return next(err);
            }
            // NOT FOUND
            if (!user) {
                logger_1.default.debug(`Auth failure: ${info}`);
                return res.sendStatus(404);
            }
            // SUCCESS
            req.logIn(user, err => {
                if (err) {
                    return next(err);
                }
                logger_1.default.debug(`Login result: ${req.user != undefined}`);
                req.session.save(() => {
                    res.json(user);
                });
            });
        })(req, res, next);
    });
}
exports.loginUser = loginUser;
/**
 * /logout
 * @method GET
 * @description Allows client to request termination of their authenticated session
 * @returns { 200 }
 */
function logoutUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("GET /logout");
        // Logout user and report the result
        req.logout();
        logger_1.default.debug(`Logout result: ${req.user != undefined}`);
        return res.sendStatus(200);
    });
}
exports.logoutUser = logoutUser;
//# sourceMappingURL=authController.js.map
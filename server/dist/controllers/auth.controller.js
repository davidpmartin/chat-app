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
exports.logoutUser = exports.loginUser = exports.getAuthStatus = exports.registerUser = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const passport_1 = __importDefault(require("passport"));
const logger_1 = __importDefault(require("../logger"));
/**
 * /users
 * @method POST
 * @description Allows registration of new user accounts
 * @returns { 200 }
 * @todo sanitise user input
 */
function registerUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("POST /users");
        // Check if username already exists
        user_model_1.User.findOne({ "username": req.body.username }, (err, user) => {
            if (err) {
                logger_1.default.error(`db failed existing username query.`);
                return next(err);
            }
            if (user) {
                logger_1.default.debug(`user with username: '${user.username}' already exists.`);
                res.send({ msg: "An account with this username already exists." }).status(404);
                return next();
            }
        });
        // Generate salt for hash function
        const saltRounds = 10;
        bcrypt_1.default.genSalt(saltRounds, (err, salt) => {
            if (err) {
                logger_1.default.error(`bcrypt failed to generate salt.`);
                return next(err);
            }
            else {
                // Hash password
                bcrypt_1.default.hash(req.body.password, salt, (err, hash) => {
                    if (err) {
                        logger_1.default.error(`bcrypt failed to hash password.`);
                        return next(err);
                    }
                    else {
                        // Create user document and save to db
                        const newUser = new user_model_1.User({
                            id: (0, uuid_1.v4)(),
                            username: req.body.username,
                            password: hash,
                            salt: salt
                        });
                        newUser.save(err => {
                            if (err) {
                                logger_1.default.error(`failed to save user to db.`);
                                next(err);
                            }
                            logger_1.default.debug(`User saved to db`);
                            return res.sendStatus(200);
                        });
                    }
                });
            }
        });
    });
}
exports.registerUser = registerUser;
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
//# sourceMappingURL=auth.controller.js.map
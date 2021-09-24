"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = __importDefault(require("../logger"));
const user_model_1 = require("../models/user.model");
/**
 * Importable setup for passportjs to perform authentication with supplied credentials and
 * maintain the session state.
 */
function default_1() {
    /**
     * Defined the passport strategy to be used for authentication
     */
    passport_1.default.use('local', new passport_local_1.default.Strategy((username, password, done) => {
        logger_1.default.debug("performing credentials check...");
        // Query db for username
        user_model_1.User.findOne({ "username": username }, (err, user) => {
            logger_1.default.debug(`db query result: ${JSON.stringify(user)}`);
            // ERROR
            if (err) {
                logger_1.default.error("db error occured during user query");
                return done(err);
            }
            // NO MATCH
            if (!user) {
                logger_1.default.debug("auth strategy returned false (couldnt find user)");
                return done(null, false, { message: 'Incorrect username or password.' });
            }
            // Compare hashed passwords
            bcrypt_1.default.compare(password, user.password, (err, match) => {
                // ERROR
                if (err) {
                    logger_1.default.error(`bcrypt error occured during the password comparison.`);
                    logger_1.default.error(`request password: '${password}' db password: '${user.password}'`);
                    return done(err);
                }
                // NO MATCH
                if (!match) {
                    logger_1.default.info("auth strategy returned false (password mismatch).");
                    return done(null, false, { message: 'Incorrect username or password.' });
                }
                logger_1.default.info("auth strategy returned true (password match)");
                return done(null, user);
            });
        });
    }));
    /**
     * Runs on successful authentication: Returned value is stored in the session as req.session.passport.user (or req.user)
     */
    passport_1.default.serializeUser((user, done) => {
        logger_1.default.info("serializeUser()");
        return done(null, user.id);
    });
    /**
     * Runs on subsequent requests: Adds the userdata back into the request object based on the ID stored in session
     */
    passport_1.default.deserializeUser((id, done) => {
        logger_1.default.info("deserializeUser()");
        // Get user from db
        user_model_1.User.findOne({ "id": id }, (err, user) => {
            if (err) {
                logger_1.default.error(`db query for user failed`);
                return done(err, false);
            }
            logger_1.default.debug(`user object returned to deserializer function`);
            return done(null, user);
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map
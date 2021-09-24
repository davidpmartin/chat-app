import passport from "passport";
import passportLocal from "passport-local";
import bcrypt from "bcrypt";
import logger from "../logger";
import { User, IUser } from "../models/user.model";
import { Mongoose } from "mongoose";

/**
 * Importable setup for passportjs to perform authentication with supplied credentials and
 * maintain the session state.
 */
export default function() {

    /**
     * Defined the passport strategy to be used for authentication
     */
    passport.use('local', new passportLocal.Strategy((username, password, done) => {
            logger.debug("performing credentials check...")

            // Query db for username
            User.findOne({ "username": username}, (err: any, user: IUser) => {

                logger.debug(`db query result: ${JSON.stringify(user)}`);

                // ERROR
                if (err) {
                    logger.error("db error occured during user query");
                    return done(err);
                }

                // NO MATCH
                if (!user) {
                    logger.debug("auth strategy returned false (couldnt find user)");
                    return done(null, false, { message: 'Incorrect username or password.' });
                }
    
                // Compare hashed passwords
                bcrypt.compare(password, user.password, (err, match) => {

                    // ERROR
                    if (err) {
                        logger.error(`bcrypt error occured during the password comparison.`);
                        logger.error(`request password: '${password}' db password: '${user.password}'`);
                        return done(err); }
                    
                    // NO MATCH
                    if (!match) {
                        logger.info("auth strategy returned false (password mismatch).");
                        return done(null, false, { message: 'Incorrect username or password.' });
                    }

                    logger.info("auth strategy returned true (password match)");
                    return done(null, user);
                })
            });
        }
    ));

    /**
     * Runs on successful authentication: Returned value is stored in the session as req.session.passport.user (or req.user)
     */
    passport.serializeUser((user: any, done) => {
        logger.info("serializeUser()");
        return done(null, user.id);
    });

    /**
     * Runs on subsequent requests: Adds the userdata back into the request object based on the ID stored in session
     */
    passport.deserializeUser((id, done) => {
        logger.info("deserializeUser()");
        
        // Get user from db
        User.findOne({ "id": id }, (err: any, user: IUser) => {
            if (err) {
                logger.error(`db query for user failed`);
                return done(err, false);
            }
            logger.debug(`user object returned to deserializer function`);
            return done(null, user);
        });
    });
}
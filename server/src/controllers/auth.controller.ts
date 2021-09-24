import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { User, IUser } from "../models/user.model";
import passport from "passport";
import logger from '../logger';

/**
 * /users
 * @method POST
 * @description Allows registration of new user accounts
 * @returns { 200 }
 * @todo sanitise user input
 */
 export async function registerUser(req: Request, res: Response, next: NextFunction) {
    logger.info("POST /users");

    // Check if username already exists
    User.findOne({ "username": req.body.username }, (err: any, user: IUser) => {
        if (err) {
            logger.error(`db failed existing username query.`);
            return next(err);
        }
        if (user) {
            logger.debug(`user with username: '${user.username}' already exists.`);
            res.send({msg: "An account with this username already exists."}).status(404);
            return next();
        }
    });

    // Generate salt for hash function
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            logger.error(`bcrypt failed to generate salt.`);
            return next(err);
        }
        else {

            // Hash password
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) {
                    logger.error(`bcrypt failed to hash password.`);
                    return next(err);
                }
                else {

                    // Create user document and save to db
                    const newUser = new User(
                        {
                            id: uuidv4(),
                            username: req.body.username,
                            password: hash,
                            salt: salt
                        }
                    );
                    newUser.save(err => {
                        if (err) {
                            logger.error(`failed to save user to db.`);
                            next(err);
                        }
                        logger.debug(`User saved to db`);
                        return res.sendStatus(200);
                    });
                }
            });
        }
    });
}

/**
 * /login
 * @method GET
 * @description Allows clients to verify authentication status
 * @returns { 200 === authenticated, 401 === unauthenticated }
 */
export async function getAuthStatus(req: Request, res: Response) {
    logger.info("GET /login");

    // Check authentication status
    if(req.isAuthenticated()) {
        logger.debug(`advising client user is authenticated`);
        return res.sendStatus(200);
    } else {
        logger.debug(`advising client user is not authenticated`);
        return res.sendStatus(401);
    }
}

/**
 * /login
 * @method POST
 * @description Allows clients to request authentication by providing a username and password
 * @returns { user === success, 404 === fail }
 */
export async function loginUser(req: Request, res: Response, next: NextFunction) {
    logger.info("POST /login");

    // Run the authencate method
    passport.authenticate('local', (err, user, info) => {
        logger.debug(`passport.auth() callback`);

        // ERROR
        if (err) {
            logger.debug(`Auth error: ${info}`);
            return next(err);
        }

        // NOT FOUND
        if (!user) {
            logger.debug(`Auth failure: ${info}`);
            return res.sendStatus(404);
        }

        // SUCCESS
        req.logIn(user, err => {
            if (err) { return next(err); }
            logger.debug(`Login result: ${ req.user != undefined }`)
            req.session.save(() => {
                res.json(user);
            });
        });
    })(req, res, next);
}

/**
 * /logout
 * @method GET
 * @description Allows client to request termination of their authenticated session
 * @returns { 200 }
 */
export async function logoutUser(req: Request, res: Response) {
    logger.info("GET /logout");

    // Logout user and report the result
    req.logout();
    logger.debug(`Logout result: ${ req.user != undefined }`)
    return res.sendStatus(200);
}
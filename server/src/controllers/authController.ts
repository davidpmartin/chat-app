import { NextFunction, Request, Response } from "express";
import passport from "passport";
import logger from '../logger';

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
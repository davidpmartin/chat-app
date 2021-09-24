import { Request, Response, NextFunction } from "express";
import logger from "../logger"

/**
 * Middleware function to control route access
 */
export const secured = (req: any, res: Response, next: NextFunction) => {
    const result = req.user != undefined
    logger.debug(`Access allowed: ${result}`);
    if (result) {
        return next();
    }
    return res.sendStatus(401);
}
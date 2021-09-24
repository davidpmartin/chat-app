import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import SocketIO from "socket.io";
import bcrypt from "bcrypt";
import logger from '../logger';
import { User, IUser } from "../models/user";
import { Message } from "../models/message";
import server from "../";


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
 * /messages
 * @method GET
 * @description Allows fetching of chat messages
 * @returns { IMessage[] }
 * @todo: add request query options (limit, etc)
 */
export async function getMessages(req: Request, res: Response, next: NextFunction) {
    logger.info("GET /messages");
    
    // Get messages from db
    Message.find({ })
        .populate("author")
        .exec((err, messages) => {
            if (err) {
                logger.error(`db failed to get messages`);
                return next(err);
            }
            return res.send(messages);
        });
}

/**
 * /messages
 * @method POST
 * @description Allows posting of chat messages
 * @returns { IMessage }
 * @todo
 *  - input validation
 *  - db storage
 *  - proper room implementation
 *  - correct type definitions
 */
export async function addMessage(req: any, res: Response, next: NextFunction) {
    logger.info("POST /messages");

    // Build message db oject
    const newMessage = new Message({
        id: uuidv4(),
        author: req.user._id,
        conversation_id: 101,
        content: req.body.text,
        created_at: req.body.created_at
    });

    // Save object to db
    newMessage.save(err => {
        if (err) {
            logger.error(`db message save failed.`);
            return next(err);
        }
        logger.debug('message saved to db.')
        newMessage.author = req.user;

        // emit message to conversation participants and return message to client
        const io: SocketIO.Server = server.getSocketConnection();
        io.emit("new_message", newMessage);
        return res.send(newMessage);
    })
}
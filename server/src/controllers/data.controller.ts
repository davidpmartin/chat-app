import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import SocketIO from "socket.io";
import logger from '../logger';
import { Message } from "../models/message.model";
import { Channel } from "../models/channel.model";
import { User } from "../models/user.model";
import server from "..";

export async function getChannels(req: Request, res: Response, next: NextFunction) {

}

/**
 * /channels
 * @method POST
 * @description Allows to creation of a new channel
 * @returns { Channel }
 */
export async function addChannel(req: Request, res: Response, next: NextFunction) {
    logger.info("POST /channels");

    // Perform a lookup on provided username to find corresponding user id
    User.findOne({ "username": req.body.username }, (err: any, user: any) => {
        
        // ERROR
        if (err) {
            logger.error(`db failed to perform user query`);
            return next(err);
        }
        // NO MATCH
        if (!user) {
            logger.debug(`User '${req.body.username}' doesn't exist`);
            return res.send({msg: "No match for username found"}).status(404);
        }

        // Build new channel db object
        const newChannel = new Channel({
            id: uuidv4(),
            participants: [req.user.id, user.id],
            messages: [],
            created_at: new Date().toISOString
        });

        // Save channel to DB
        newChannel.save(err => {
            // ERROR
            if (err) {
                logger.error(`db failed to save new channel`);
                return next(err);
            }

            // Get IO client and check if queried user is online
            const io: SocketIO.Server = server.getSocketConnection();

            // Important docs:
            // https://github.com/socketio/socket.io/blob/master/examples/passport-example/index.js
            // https://github.com/socketio/socket.io/blob/master/examples/passport-example/index.html
            // https://socket.io/docs/v4/server-instance/#fetchSockets

            io.emit("new_message", newChannel);
            return res.send(newChannel);
        });
    });
}

/**
 * /messages
 * @method GET
 * @description Allows fetching of chat messages
 * @returns { Message[] }
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
 * @returns { Message }
 * @todo
 *  - input validation
 *  - db storage
 *  - proper channel implementation
 *  - correct type definitions
 */
export async function addMessage(req: Request, res: Response, next: NextFunction) {
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
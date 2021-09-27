import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import SocketIO from "socket.io";
import logger from '../logger';
import { Message } from "../models/message.model";
import { Channel } from "../models/channel.model";
import { User, IUser } from "../models/user.model";
import server from "..";

/**
 * /channels
 * @method POST
 * @description Returns the channels of which the client is a participant
 * @returns { Channel }[]
 */
export async function getChannels(req: Request, res: Response, next: NextFunction) {
    logger.info("GET /channels");

    // Perform query for channels of which the req.user is a participant
    Channel.find({ "participants": `ObjectId(${req.user._id})` }, (err, channels) => {
        if(err) {
            logger.error(`db failed to complete channel query`);
            return next(err);
        }
        return res.send(channels);
    });
}

/**
 * /channels/:channelId/messages?options
 * @method POST
 * @description Returns the channels of which the client is a participant
 * @returns { Channel }[]
 */
export async function getChannelMessages(req: Request, res: Response, next: NextFunction) {
    return res.send("Not yet implemented!");
}

/**
 * /channels
 * @method POST
 * @description Allows the creation of a new channel
 * @returns { Channel }
 */
export async function addChannel(req: Request, res: Response, next: NextFunction) {
    logger.info("POST /channels");

    // Check user isn't searching for themselves
    if (req.body.username === req.user.username) {
        logger.debug(`user tried friending themselves lol`);
        return res.status(404).send({msg: "You cannot add yourself."});
    }

    // Perform a lookup on provided username to find corresponding user id
    User.findOne({ "username": req.body.username }, (err: any, returnedUser: IUser) => {
        
        // ERROR
        if (err) {
            logger.error(`db failed to complete user query`);
            return next(err);
        }
        // NO MATCH
        if (!returnedUser) {
            logger.debug(`User '${req.body.username}' doesn't exist`);
            return res.status(404).send({msg: "No match for username found."});
        }

        // Check if returned user is already a friend of the client
        if (req.user.friends.find(id => returnedUser._id.equals(id))) {
            logger.debug(`users are already friends`)
            return res.status(404).send({msg: "You are already friends with this user."});
        }

        // Build new channel db object
        const newChannel = new Channel({
            id: uuidv4(),
            participants: [req.user._id, returnedUser._id],
            messages: [],
            created_at: new Date().toISOString
        });

        // Perform the channel save and add both users to eachothers friends ref
        Promise.all([
            User.updateOne({ "_id": req.user._id }, { $addToSet: { "friends": returnedUser._id } }),
            User.updateOne({ "_id": returnedUser._id }, { $addToSet: { "friends": req.user._id } }),
            newChannel.save()
        ])
        .then(async ([reqUser, newFriend, channel]) => {
            logger.debug(`channel saved to db and client friend record updated`);
            
            // Populate the User refs and return to client
            await channel.populate("participants");
            req.user.friends.push(returnedUser._id);
            return res.send(channel);
        })
        .catch(err => {
            logger.error(`db failed the new channel operation`);
            return next(err);
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
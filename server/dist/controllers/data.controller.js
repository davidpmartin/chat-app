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
exports.addMessage = exports.getMessages = exports.addChannel = exports.getChannels = void 0;
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("../logger"));
const message_model_1 = require("../models/message.model");
const channel_model_1 = require("../models/channel.model");
const user_model_1 = require("../models/user.model");
const __1 = __importDefault(require(".."));
function getChannels(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
exports.getChannels = getChannels;
/**
 * /channels
 * @method POST
 * @description Allows to creation of a new channel
 * @returns { Channel }
 */
function addChannel(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("POST /channels");
        // Perform a lookup on provided username to find corresponding user id
        user_model_1.User.findOne({ "username": req.body.username }, (err, user) => {
            // ERROR
            if (err) {
                logger_1.default.error(`db failed to perform user query`);
                return next(err);
            }
            // NO MATCH
            if (!user) {
                logger_1.default.debug(`User '${req.body.username}' doesn't exist`);
                return res.send({ msg: "No match for username found" }).status(404);
            }
            // Build new channel db object
            const newChannel = new channel_model_1.Channel({
                id: (0, uuid_1.v4)(),
                participants: [req.user.id, user.id],
                messages: [],
                created_at: new Date().toISOString
            });
            // Save channel to DB
            newChannel.save(err => {
                // ERROR
                if (err) {
                    logger_1.default.error(`db failed to save new channel`);
                    return next(err);
                }
                // Get IO client and check if queried user is online
                const io = __1.default.getSocketConnection();
                io.emit("new_message", newChannel);
                return res.send(newChannel);
            });
        });
    });
}
exports.addChannel = addChannel;
/**
 * /messages
 * @method GET
 * @description Allows fetching of chat messages
 * @returns { Message[] }
 * @todo: add request query options (limit, etc)
 */
function getMessages(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("GET /messages");
        // Get messages from db
        message_model_1.Message.find({})
            .populate("author")
            .exec((err, messages) => {
            if (err) {
                logger_1.default.error(`db failed to get messages`);
                return next(err);
            }
            return res.send(messages);
        });
    });
}
exports.getMessages = getMessages;
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
function addMessage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("POST /messages");
        // Build message db oject
        const newMessage = new message_model_1.Message({
            id: (0, uuid_1.v4)(),
            author: req.user._id,
            conversation_id: 101,
            content: req.body.text,
            created_at: req.body.created_at
        });
        // Save object to db
        newMessage.save(err => {
            if (err) {
                logger_1.default.error(`db message save failed.`);
                return next(err);
            }
            logger_1.default.debug('message saved to db.');
            newMessage.author = req.user;
            // emit message to conversation participants and return message to client
            const io = __1.default.getSocketConnection();
            io.emit("new_message", newMessage);
            return res.send(newMessage);
        });
    });
}
exports.addMessage = addMessage;
//# sourceMappingURL=data.controller.js.map
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
exports.addMessage = exports.getMessages = exports.registerUser = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = __importDefault(require("../logger"));
const user_1 = require("../models/user");
const message_1 = require("../models/message");
const __1 = __importDefault(require("../"));
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
        user_1.User.findOne({ "username": req.body.username }, (err, user) => {
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
                        const newUser = new user_1.User({
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
 * /messages
 * @method GET
 * @description Allows fetching of chat messages
 * @returns { IMessage[] }
 * @todo: add request query options (limit, etc)
 */
function getMessages(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("GET /messages");
        // Get messages from db
        message_1.Message.find({})
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
 * @returns { IMessage }
 * @todo
 *  - input validation
 *  - db storage
 *  - proper room implementation
 *  - correct type definitions
 */
function addMessage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("POST /messages");
        // Build message db oject
        const newMessage = new message_1.Message({
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
//# sourceMappingURL=dataController.js.map
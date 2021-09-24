import mongoose from 'mongoose';
import logger from "../logger";

export default function() {
    logger.debug("connecting to db...");
    mongoose.connect('mongodb://localhost:27017/chat_dev', err => {
        if (err) {
            logger.debug("db connection failed.");
            logger.error(err);
        }
        logger.info("db connection established.");
    });
}
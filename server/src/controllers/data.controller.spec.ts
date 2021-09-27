import mongoose from "mongoose";
import mocha from "mocha";
import chai from "chai";
import sinon from "sinon";
import logger from "../logger";
import { User } from "../models";
import * as dataController from "../controllers/data.controller";

// Setup db connection
mongoose.connect(`mongodb://localhost:27017/test`);
mongoose.connection
    .once('open', () => logger.debug('db connected'))
    .on('error', err => {
        logger.error(`error establishing db connection`);
        logger.error(err);
    });

// Declare test-wide dummy values
const request: any = { body: { }, user: { }};
const response: any = { send(){}, status(){} };
const next: any = sinon.spy();

// Before each test, clear db and reset dummy objects
beforeEach(done => {
    mongoose.connection.collections.test.drop(() => {
        logger.debug(`db test collection cleared`);

        request.body = {};
        request.user = {};
        done();
    });
});

// Adding a channel
describe(`Creating a channel`, () => {

    // Test conditions setup
    before(done => {

        // Create user 'bob'
        User.create({ id: 1, username: 'bob', password: '123', salt: '321' }, (err, user) => {
            if (err) throw new Error("db failed to setup test env");
            request.user = user;
        });
    });

    // Setup test values
    request.body.username = "alice";

    it('should create a channel document', done => {

        const result = dataController.addChannel(request, response, next);
        logger.info(result);

    });

    it('should not create a channel with identical participants', done => {



    });


});
// Getting channels

// Adding a message

// Getting messages
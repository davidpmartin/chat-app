import { Server, Socket } from "socket.io";
import { NextFunction } from "express";
import session from "express-session";
import http from "http";
import logger from "./logger";
import sessionConfig from "./config/session.config";
import passport from "passport";

// Exportable function to apply socket.io listeners to http server
export default function socket(server: http.Server): Server {

    // Instantiate socket.io server object and bind to http server
    const io: Server = new Server(server);

    // Create a wrapper middleware and bind to passport
    const wrap = (middleware: any) => (socket: Socket, next: NextFunction) => middleware(socket.request, {}, next);
    io.use(wrap(session(sessionConfig)));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    // Add an authentication middleware
    io.use((socket: any, next) => {
        logger.debug(socket);
        logger.debug(socket.request);
        logger.debug(socket.request.user);
        if (socket.request.user) {
            next();
        } else {
            next(new Error('Unauthorized'));
        }
    });

    // On client connection
    io.on("connection", (socket: any) => {
        logger.debug(`new connection established: ${socket.id}`);

        // set listener for client to retrieve their session user
        socket.on('whoami', (cb: CallableFunction) => {
            cb(socket.request.user ? socket.request.user.username : "")
        });

        // save the socket id alongside the session id
        const session = socket.request.session;
        logger.debug(`saving sid ${socket.id} in session ${session.id}`);
        session.socketId = socket.id;
        session.save();

        // notify of disconnects
        socket.on("disconnect", () => {
            logger.debug(`client on ${socket.handshake.address} disconnected`);
        });
    });

    return io;
};
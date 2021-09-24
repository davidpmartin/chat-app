import { Server } from "socket.io";
import http from "http";
import logger from "./logger";

// Exportable function to apply socket.io listeners to http server
export default function socket(server: http.Server): Server {

    // Instantiate socket.io server object and bind to http server
    const io = new Server(server);

    // On client connection
    io.on("connection", (socket) => {

        logger.debug(`client on ${socket.handshake.address} connected`);
        
        // test receive/response
        socket.on("ping", () => {
            logger.debug("How dare they ping me! I'll show them...");
            socket.emit("pong");
        });

        // notify of disconnects
        socket.on("disconnect", () => {
            logger.debug(`Client on ${socket.handshake.address} disconnected`);
        });
    });

    return io;
};
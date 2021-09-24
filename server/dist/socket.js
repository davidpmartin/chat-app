"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("./logger"));
// Exportable function to apply socket.io listeners to http server
function socket(server) {
    // Instantiate socket.io server object and bind to http server
    const io = new socket_io_1.Server(server);
    // On client connection
    io.on("connection", (socket) => {
        logger_1.default.debug(`client on ${socket.handshake.address} connected`);
        // notify of disconnects
        socket.on("disconnect", () => {
            logger_1.default.debug(`client on ${socket.handshake.address} disconnected`);
        });
    });
    return io;
}
exports.default = socket;
;
//# sourceMappingURL=socket.js.map
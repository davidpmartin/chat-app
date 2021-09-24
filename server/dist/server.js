"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const helmet_1 = __importDefault(require("helmet"));
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const logger_1 = __importDefault(require("./logger"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_1 = __importDefault(require("./socket"));
const auth_1 = __importDefault(require("./init/auth"));
const db_1 = __importDefault(require("./init/db"));
/** Main server class */
class ChatServer {
    // Initialize the express app, http server, and apply socket.io listeners
    constructor() {
        this.port = 5050;
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.port = 5050;
        this.io = (0, socket_1.default)(this.server);
        // Import inits
        (0, auth_1.default)();
        (0, db_1.default)();
        // Apply various middlewares
        this.app.use((0, helmet_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.static("../client/dist"));
        this.app.use((0, cors_1.default)());
        this.app.use((0, express_session_1.default)({
            name: "sessionId",
            genid: () => (0, uuid_1.v4)(),
            secret: "placeholder_secret",
            cookie: {
                secure: process.env.NODE_ENV === "prod",
                httpOnly: process.env.NODE_ENV === "prod"
            },
            resave: false,
            saveUninitialized: true
        }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.authenticate('session'));
        // Define routes
        (0, routes_1.applyRoutes)(this.app);
        // Fall-back route (to accomodate SPA routing config)
        this.app.get("*", (req, res) => res.sendFile(path_1.default.resolve("../client/dist", "index.html")));
        // Start listening on port
        this.server.listen(this.port, () => {
            logger_1.default.info(`server started on http://localhost:${this.port}`);
        });
    }
    /**
     * @description Getter to allow program access to the socketio instance
     * @params {}
     * @returns SockerIO.Server
     */
    getSocketConnection() {
        return this.io;
    }
}
exports.default = ChatServer;
//# sourceMappingURL=server.js.map
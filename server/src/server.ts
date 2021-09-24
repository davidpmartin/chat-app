import express, { Express } from "express";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import { applyRoutes } from "./routes/index.route";
import logger from "./logger";
import path from "path";
import http from "http";
import SocketIO from "socket.io"
import socket from "./socket";
import initAuth from "./init/auth";
import initDb from "./init/db";

/** Main server class */
export default class ChatServer {

    private app: Express;
    private server: http.Server;
    private port: number = 5050;
    private io: SocketIO.Server;

    // Initialize the express app, http server, and apply socket.io listeners
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.port = 5050;
        this.io = socket(this.server);

        // Import inits
        initAuth();
        initDb();

        // Apply various middlewares
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static("../client/dist"));
        this.app.use(cors());
        this.app.use(session({
            name: "sessionId",
            genid: () => uuidv4(),
            secret: "placeholder_secret",
            cookie: {
                secure: process.env.NODE_ENV === "prod",
                httpOnly: process.env.NODE_ENV === "prod"
            },
            resave: false,
            saveUninitialized: true
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.authenticate('session'));

        // Define routes
        applyRoutes(this.app);

        // Fall-back route (to accomodate SPA routing config)
        this.app.get("*", (req, res) => {
            logger.debug(JSON.stringify(req.session));
            return res.sendFile(path.resolve("../client/dist", "index.html"));
        });

        // Start listening on port
        this.server.listen(this.port, () => {
            logger.info(`server started on http://localhost:${this.port}`);
        });
    }

    /**
     * @description Getter to allow program access to the socketio instance
     * @params {}
     * @returns SockerIO.Server
     */
    public getSocketConnection(): SocketIO.Server {
        return this.io;
    }
}

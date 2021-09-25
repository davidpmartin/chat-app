declare module 'express-session' {
    interface SessionData {
        socketId?: string;
    }
}

export {}
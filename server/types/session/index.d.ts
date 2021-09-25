declare global {
    namespace session {
        interface SessionData {
            socketId?: string;
        }
    }
}

export {}

/* declare module 'express-session' {
   interface SessionData {
       socketId?: string;
   }
} */
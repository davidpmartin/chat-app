declare global {
    namespace Express {
        interface User {
            id?: string;
            _id?: string;
            friends?: string[];
            username?: string;
        }
    }
}

export {}
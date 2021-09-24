import { Schema, model, Document } from 'mongoose';

/**
 * User interface, db schema, db model
 */
export interface IUser extends Document {
    id: string,
    username: string,
    password: string,
    salt: string
}

const schema: Schema = new Schema<IUser>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    salt: {
        type: String,
        require: true
    },
});

export const User = model<IUser>('User', schema);
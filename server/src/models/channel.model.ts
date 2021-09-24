import { Schema, model, Document } from 'mongoose';

/**
 * Channel interface, db schema, db model
 */
export interface IChannel extends Document {
    id: string,
    participants: string[],
    messages: string[],
    created_at: string
}

const schema: Schema = new Schema<IChannel>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User', require: true
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message', require: true
    }],
    created_at: {
        type: String,
        require: true
    }
});

export const Channel = model<IChannel>('Channel', schema);
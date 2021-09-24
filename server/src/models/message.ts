import { Schema, model, Document } from 'mongoose';

/**
 * Message interface, db schema, db model
 */
export interface IMessage extends Document {
    id: string,
    author: object,
    conversation_id: string,
    content: string,
    created_at: Date
}

const schema: Schema = new Schema<IMessage>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', require: true
    },
    conversation_id: {
        type: String,
        require: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        require: true
    }
});

export const Message = model<IMessage>('Message', schema);
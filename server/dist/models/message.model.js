"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.Message = (0, mongoose_1.model)('Message', schema);
//# sourceMappingURL=message.model.js.map
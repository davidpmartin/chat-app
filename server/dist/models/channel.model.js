"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    participants: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User', require: true
        }],
    messages: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Message', require: true
        }],
    created_at: {
        type: String,
        require: true
    }
});
exports.Channel = (0, mongoose_1.model)('Channel', schema);
//# sourceMappingURL=channel.model.js.map
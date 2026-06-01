const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // reference to User model
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // reference to User model
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is incorrect status type!"
        }
    }
}, { timestamps: true })

// after schema definition we are creating compound index
connectionRequestSchema.index({ senderId: 1, receiverId: 1 })

const ConnectionRequest = mongoose.model(
    "ConnectionRequest", 
    connectionRequestSchema
);

module.exports = ConnectionRequest;

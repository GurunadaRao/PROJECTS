const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { use } = require("react");


const messageScheme = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String ,
        required: true,
    },
    
    group: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Group",
    },


}, {
    timestamps: true,
});
const Message = mongoose.model("Message", messageScheme);
module.exports = Message;
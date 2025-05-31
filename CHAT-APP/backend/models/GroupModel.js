const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { use } = require("react");


const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim
    },
    description: {
        type: String,
        required: true,
       
    },
    memebers:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    admin:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
}, {
    timestamps: true,
});
//Hash password


const  Group = mongoose.model("Group", groupSchema);
module.exports = Group;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { use } = require("react");


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,

    },
    isAdmin: {
        type: Boolean,
        
        default: false,
    }
}, {
    timestamps: true,
});
//Hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
     return   next();
    }
    
    this.password = await bcrypt.hash(this.password, salt);
 
})
//method to compare the password
userSchema.methods.matchPassword = async function (enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
}

const User = mongoose.model("User", userSchema);
module.exports = User;
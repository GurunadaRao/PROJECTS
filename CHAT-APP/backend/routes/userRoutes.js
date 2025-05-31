const express = require("express");
const router = express.Router();
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

userRouter.post('/',async(req,res)=>{
    try {
        const {username , email , password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }
        const user = await User.create({
            username,
            email,
            password,
        });
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.status(201).json({user,token}); 
    } catch (error) {
        res.status(500).json({message:error.message});
    }
})
userRoute.post('/login',async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
         if(user && (await user.matchPassword(password))){
            res.json({
                user:{
                    id:user._id,
                    username:user.username,
                    email:user.email,
                    isAdmin :user.isAdmin,
                    token : generateToken(user._id),
                }
            })
         }
         else{
            res.status(400).json({message:"Invalid email or password"});    
         }
        } catch (error) {
            res.status(500).json({message:error.message});
        }
});
//generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
}
module.exports = userRouter;
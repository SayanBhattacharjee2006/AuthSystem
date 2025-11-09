import User from "../../backend/models/user.model.js";
import bcryptjs from "bcryptjs";
import {generateTokenAndSetCookie} from "../../backend/utils/generateTokenAndSetCookie.js";
import crypto from "crypto";

export const signup = async (req, res) => {
    const {email,name,password} = req.body;
    try {
        if(!email || !name || !password){
            return res.status(400).json({message:"Please enter all the fields"})
        }

        const userAlreadyExist = await User.findOne({email});
        if(userAlreadyExist){
            return res.status(400).json({success:false,message:"User already exist"})
        }

        const hashedPassword = await bcryptjs.hash(password,10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await User.create({
            email,
            name,
            password:hashedPassword,
            verificationToken,
            verificationExpiresAt
        });

        generateTokenAndSetCookie(res,user._id);

        res
            .status(201)
            .json({
                success:true,
                message:"User created successfully",
                user:{
                    ...user._doc,
                    password:undefined
                }});

    } catch (error) {
        res.status(500).json({success:false,message:"Internal server error"})
    }
}
export const signin = async (req, res) => {
    res.send("signin");
}
export const logout = async (req, res) => {
    res.send("logout");
}
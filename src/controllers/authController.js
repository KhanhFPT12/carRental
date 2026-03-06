const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "mysecretkey";

// register
exports.register = async (req,res)=>{
    try{

        const {username,password} = req.body;

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new User({
            username,
            password:hashedPassword
        });

        await user.save();

        res.status(201).json({message:"User registered successfully"});

    }catch(err){
        res.status(500).json({message:err.message});
    }
};

// login
exports.login = async (req,res)=>{
    try{

        const {username,password} = req.body;

        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"});
        }

        const token = jwt.sign(
            { id:user._id, role:user.role },
            JWT_SECRET,
            { expiresIn:"1d" }
        );

        res.json({
            message:"Login successful",
            token
        });

    }catch(err){
        res.status(500).json({message:err.message});
    }
};
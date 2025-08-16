import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}
//Route for user login
const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User does not exists"}); 
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if(isMatched){
            const token = createToken(user._id);
            res.json({
                success: true, 
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    createdAt: user.createdAt
                }
            });
        }
        else{
            res.json({success: false, messsage: 'Invalid credentials'});
        }
    }
    catch(error){
        console/log(error);
        res.json({success: false, message: error.message})
    }
}

//Route for User Register
const registerUser = async(req, res) => {
    try{
        const {name, email, password} = req.body;
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success: false, message: "User already exists"});
        }
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success: false, message: "Please enter a strong password"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({
            success: true, 
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        })
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//Route for admin login
const adminLogin = async(req, res) => {
    try{
        const { email, password } = req.body;
        if(email !== process.env.ADMIN_EMAIL){
            return res.json({ success: false, message: "Not authorized as admin" });
        }
        const user = await userModel.findOne({ email });
        if(!user){
            return res.json({ success: false, message: "Admin does not exist" });
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if(isMatched){
            const token = createToken(user._id);
            return res.json({ 
                success: true, 
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: 'Super Admin',
                    createdAt: user.createdAt
                }
            });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }
    } catch(error){
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//Route for getting single user details
const singleUser = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email }).select('-password');
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//Route for getting all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

//Route for admin signup
const adminRegister = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (
            email !== process.env.ADMIN_EMAIL ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.json({ success: false, message: "Invalid admin credentials for signup" });
        }
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "Admin already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const adminUser = new userModel({
            name: "Admin",
            email,
            password: hashedPassword
        });
        await adminUser.save();
        const token = createToken(adminUser._id);
        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { loginUser, registerUser, adminLogin, singleUser, getAllUsers, adminRegister }
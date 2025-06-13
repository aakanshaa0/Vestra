import validator from "validator";
import bcrypt from "bcypt";
import userModel from "../models/userModel.js";

//Route for user login
const loginUser = async(req, res) => {
    res.json({msg: "Login API working"});
}

//Route for User Register
const registerUser = async(req, res) => {
    try{
        const {name, email, password} = req.body;
        //checking is user exists or not
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success: false, message: "User already exists"});
        }
        //validating email format & password
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email"})
        }
        if(password.length<8){
            return res.json({success: false, message: "Please enter a strong password"})
        }
        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        })
        const user = await newUser.save();

        const token = 
    }
    catch(error){

    }
}

//Route for admin login
const adminLogin = async(req, res) => {
    res.json({msg: "Login API working"});
}

export { loginUser, registerUser, adminLogin }
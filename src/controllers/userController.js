

const mongoose = require('mongoose');
const userModel = require("../models/userModel");
const forgotPasswordModel = require("../models/forgotPasswordModel")
const contactUsModel = require("../models/contactUsModel")
const jwt = require('jsonwebtoken');
// const verificationModel = require("../models/verificationModel");
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const validation = require("../validations/validation");
const bcrypt = require('bcrypt');
// const admin = require('../models/adminModel');


const userRegister = async function (req, res) {
    try {
        let userData = req.body;

        let { name, email, password, confirmPassword } = userData;

        if (Object.keys(userData).length == 0)
            return res.status(400).send({ status: false, message: "please provide required fields" });


        if (!name)
            return res.status(400).send({ status: false, message: " name is mandatory" });

        if (typeof name != "string")
            return res.status(400).send({ status: false, message: " name should be in string" });

        // regex
        name = userData.name = name.trim();

        if (name == "")
            return res.status(400).send({ status: false, message: "Please Enter  name value" });


        //================================ email ======

        if (!email)
            return res.status(400).send({ status: false, message: "email is mandatory" });

        if (typeof email != "string")
            return res.status(400).send({ status: false, message: "email id  should be in string" });

        //=========== email =======

        email = userData.email = email.trim().toLowerCase()
        if (email == "")
            return res.status(400).send({ status: false, message: "Please enter email value" });

        if (!validation.validateEmail(email))
            return res.status(400).send({ status: false, message: "Please provide valid email id" });


        //========= password ======

        // if (!password)
        //     return res.status(400).send({ status: false, message: "password is mandatory" });

        // if (typeof password != "string")
        //     return res.status(400).send({ status: false, message: "please provide password in string " });

        // password = userData.password = password.trim();
        // if (password == "")
        //     return res.status(400).send({ status: false, message: "Please provide password value" });


        // //regex password
        // if (!validation.validatePassword(password))
        //     return res.status(400).send({ status: false, message: "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character" });

        // //Encrypting password
        // let hashing = bcrypt.hashSync(password, 10);
        // userData.password = hashing;

        if (!password)
            return res
                .status(400)
                .send({ status: false, message: "password is mandatory" });

        if (typeof password != "string")
            return res
                .status(400)
                .send({ status: false, message: "please provide password in string " });
        password = userData.password = password.trim();

        if (password == "")
            return res
                .status(400)
                .send({ status: false, message: "Please provide password value" });

        if (!validation.validatePassword(password))
            return res.status(400).send({
                status: false,
                message:
                    "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
            });

        //Encrypting password
        let hashingPassword = bcrypt.hashSync(password, 10);
        userData.password = hashingPassword;

        //___________________________________confirmPassword______________________________________

        if (!password)
            return res
                .status(400)
                .send({ status: false, message: "password is mandatory" });

        if (!confirmPassword)
            return res
                .status(400)
                .send({ status: false, message: "confirmPassword is mandatory" });

        if (typeof confirmPassword != "string")
            return res.status(400).send({
                status: false,
                message: "please provide confirmPassword in string ",
            });

        confirmPassword = userData.confirmPassword = confirmPassword.trim();

        if (confirmPassword == "")
            return res.status(400).send({
                status: false,
                message: "Please provide confirmPassword value",
            });

        if (!validation.validatePassword(confirmPassword))
            return res.status(400).send({
                status: false,
                message:
                    "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
            });

        let passwordCompare = await bcrypt.compare(
            confirmPassword, userData.password
        );
        console.log(passwordCompare);
        if (!passwordCompare)
            return res
                .status(404)
                .send({ status: false, message: "password doesn't match" });

        //Encrypting confirmpassword
        let hashingconfirmPassword = bcrypt.hashSync(password, 10);
        userData.confirmPassword = hashingconfirmPassword;

        const userExist = await userModel.findOne({ $or: [{ email: email }] });

        if (userExist) {
            if (userExist.email == email)
                return res.status(400).send({ status: false, message: "email id  already exist, send another email" });

        }

        const userCreated = await userModel.create(userData);

        return res.status(201).send({ status: true, message: "Your Account has been successfully Registered", data: userCreated });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({ status: false, message: error.message });
    }
};


const userLogin = async function (req, res) {
    try {
        let data = req.body;
        let { email, password } = data;

        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, message: "Please send data" });


        if (!email)
            return res.status(400).send({ status: false, message: "Please enter Emaill" });


        if (email != undefined && typeof email != "string")
            return res.status(400).send({ status: false, message: "Please enter Emaill in string format" });

        email = data.email = email.trim();
        if (email == "")
            return res.status(400).send({ status: false, message: "Please enter Email value" });

        if (!validation.validateEmail(email))
            return res.status(400).send({ status: false, message: "Please enter valid Email" });

        if (!password)
            return res.status(400).send({ status: false, message: "Please enter password" });

        if (password != undefined && typeof password != "string")
            return res.status(400).send({ status: false, message: "Please enter password in string format" });

        password = data.password = password.trim();

        if (password == "")
            return res.status(400).send({ status: false, message: "Please enter password" });

        if (!validation.validatePassword(password))
            return res.status(400).send({ status: false, message: "Please enter valid password" });

        //       

        let isUserExist = await userModel.findOne({ email: email });

        if (!isUserExist)
            return res.status(404).send({ status: false, message: "No user found with given Email", });

        let passwordCompare = await bcrypt.compare(password, isUserExist.password);

        if (!passwordCompare) return res.status(400).send({ status: false, message: "Please enter valid password" })

        const expirationInSeconds = parseInt(process.env.EXP_IN);
        let token = jwt.sign(
            { userId: isUserExist._id, exp: Math.floor(Date.now() / 1000) + expirationInSeconds },
            "NEHA"
        );

        let tokenInfo = { userId: isUserExist._id, token: token, email: email };

        res.setHeader('x-api-key', token)

        return res.status(200).send({ status: true, message: "Login Successful", data: tokenInfo });

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "anmolkadam369@gmail.com",
        pass: "hxbnkexuszarmooe",
    },
});

const sendForgotPasswordEmail = (email, token) => {
    const mailOptions = {
        from: "anmolkadam369@gmail.com",
        to: email,
        subject: "Password Reset",
        text: `Click the link to reset your password: https://the-salt-legal.vercel.app/#/reset-password/${token}`,
        // http://localhost:3001/administration/resetPassword/${token}
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

const forgotPasswordClient = async (req, res) => {
    console.log(process.env.PASS);

    let forgotPassword = req.body;
    let { email, resetToken, resetTokenExpires } = forgotPassword;
    const foundforgotPassword = await userModel.findOne({ email: email });
    console.log("fondform", foundforgotPassword)
    if (!foundforgotPassword) {
        return res.status(404).json({ message: "user not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    console.log("token:", token);

    email = forgotPassword.email = email;
    resetToken = forgotPassword.resetToken = token;
    console.log("resetToken:", resetToken);

    resetTokenExpires = forgotPassword.resetTokenExpires = Date.now() + 6000000;
    console.log("resetTokenExpires:", resetTokenExpires);
    console.log("forgotPassword:      ", forgotPassword);
    let allInfo = await forgotPasswordModel.create(forgotPassword);
    res.status(200).send({ status: true, message: allInfo });
    req.token = token;
    console.log(req.token);
    sendForgotPasswordEmail(email, token);

};

const resetPasswordClient = async (req, res) => {
    let data = req.body;
    let { newPassword, confirmPassword } = data;
    let token = req.params.token;

    if (!newPassword)
        return res
            .status(400)
            .send({ status: false, message: "newPassword is mandatory" });

    if (typeof newPassword != "string")
        return res.status(400).send({
            status: false,
            message: "please provide newPassword in string ",
        });
    newPassword = data.newPassword = newPassword.trim();

    if (newPassword == "")
        return res
            .status(400)
            .send({ status: false, message: "Please provide newPassword value" });

    if (!validation.validatePassword(newPassword))
        return res.status(400).send({
            status: false,
            message:
                "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
        });

    //Encrypting newPassword
    let hashingnewPassword = bcrypt.hashSync(newPassword, 10);
    newPassword = data.newPassword = hashingnewPassword;

    //___________________________________confirmPassword______________________________________

    if (!confirmPassword)
        return res
            .status(400)
            .send({ status: false, message: "confirmPassword is mandatory" });

    if (typeof confirmPassword != "string")
        return res.status(400).send({
            status: false,
            message: "please provide confirmPassword in string ",
        });

    confirmPassword = data.confirmPassword = confirmPassword.trim();

    if (confirmPassword == "")
        return res
            .status(400)
            .send({ status: false, message: "Please provide confirmPassword value" });

    if (!validation.validatePassword(confirmPassword))
        return res.status(400).send({
            status: false,
            message:
                "8-15 characters, one lowercase letter, one number and maybe one UpperCase & one special character",
        });

    let passwordCompare = await bcrypt.compare(confirmPassword, data.newPassword);
    console.log(passwordCompare);
    if (!passwordCompare)
        return res
            .status(404)
            .send({ status: false, message: "password doesn't match" });

    //Encrypting confirmpassword
    let hashingconfirmPassword = bcrypt.hashSync(confirmPassword, 10);
    confirmPassword = data.confirmPassword = hashingconfirmPassword;

    const user = await forgotPasswordModel.findOne({ resetToken: token });
    console.log(user);
    if (!user) return res.status(400).send({ status: false, message: 'Invalid token' });
    if (user.resetTokenExpires < Date.now())
        return res.status(400).send({ status: false, message: "Token expired" });
        // if (user.resetTokenExpires < Date.now())
        // return res.status(400).send({ status: false, message: "Token expired" });
    
    let some = await userModel.findOneAndUpdate(
    { email: user.email },
    { $set: { password: newPassword, confirmPassword: confirmPassword } },
    { new: true }
);
    console.log(some);
    return res.json({ message: "Password reset successful" });
};


const contactUs = async (req, res) => {
    try {
        let contactUsData = req.body;
        let { name, email, phone, message ,queryDate ,queryTime } = contactUsData;

        if (Object.keys(contactUsData).length == 0)
            return res.status(400).send({ status: false, message: "please provide required fields" });

        //=========== name =======

        if (!name)
            return res.status(400).send({ status: false, message: " name is mandatory" });

        if (typeof name != "string")
            return res.status(400).send({ status: false, message: " name should be in string" });

        name = contactUsData.name = name.trim();

        if (name == "")
            return res.status(400).send({ status: false, message: "Please Enter  name value" });

        //=========== email =======
        if (!email)
            return res.status(400).send({ status: false, message: "email is mandatory" });

        if (typeof email != "string")
            return res.status(400).send({ status: false, message: "email id  should be in string" });

        email = contactUsData.email = email.trim().toLowerCase()
        if (email == "")
            return res.status(400).send({ status: false, message: "Please enter email value" });

        if (!validation.validateEmail(email))
            return res.status(400).send({ status: false, message: "Please provide valid email id" });

        //=========== phone =======
        if (!phone)
        return res.status(400).send({ status: false, message: "phone is mandatory" });
        if (typeof phone != "string")
        return res.status(400).send({ status: false, message: "phone id  should be in string" });
        if (!validation.validateNumber(phone)) 
        return res.status(400).send({ status: false, message: "Please provide valid phone number" });

        //=========== message =======
        if (!message)
        return res.status(400).send({ status: false, message: "message is mandatory" });

        if (typeof message != "string")
            return res.status(400).send({ status: false, message: "message id  should be in string" });

        if (message == "")
            return res.status(400).send({ status: false, message: "Please enter message value" });
    
        queryDate = contactUsData.queryDate = new Date().toLocaleDateString();
        queryTime = contactUsData.queryTime = new Date().toLocaleTimeString();
        console.log(queryDate, queryTime)
        let createdData = await contactUsModel.create(contactUsData);
        return res.status(201).send({ status: true, message: "query submitted !!!", data: createdData });
        } 
    catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}

const getContactUs = async (req,res)=>{
    try {
        let contactUsDetails = await contactUsModel.find();
        return res.status(201).send({ status: true, message: "All data !!!", data: contactUsDetails });
        
    } catch (error) {
        return res.status(500).send({ status: false, error: err.message });
    }
}

module.exports = { userRegister, userLogin, forgotPasswordClient, resetPasswordClient ,contactUs,getContactUs }
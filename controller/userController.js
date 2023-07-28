const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require('otp-generator');
const Router = require("express").Router();
const { User } = require('../models/userModel');
const { Otp } = require('../models/otpModel');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    service: "gmail", // Replace with your SMTP service provider (e.g., 'gmail', 'sendgrid', etc.)
    auth: {
      user: "pinkyguptaa01@gmail.com", // Replace with your SMTP username
      pass: "Computerscience", // Replace with your SMTP password
    },
  });
  
  // API endpoint to send OTP to email
Router.post("/send-otp", (req, res) => {
    const { email } = req.body;
  
    // Generate OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
  
    // Email content
    const mailOptions = {
      from: "pinkyguptaa01@gmail.com", // Replace with your sender email
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is: ${otp}`,
    };
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        res.status(500).json({ message: "Error sending OTP" });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "OTP sent successfully" });
      }
    });
  });


Router.post("/signup", async (req, res) => {
    const user = await User.findOne({
        number: req.body.number
    });
    if (user) return res.status(400).send("User already registered!");
    const OTP = otpGenerator.generate(6, {
        digits: true, alphabets: false, upperCase: false, specialChars: false
    });
    const number = req.body.number;
    console.log(OTP,"huh")
    // const greenwebsms = new URLSearchParams();
    // greenwebsms.append('token', '05fa33c4cb50c35f4a258e85ccf50509');
    // greenwebsms.append('to', `+${number}`);
    // greenwebsms.append('message', `Verification Code ${OTP}`);
    // axios.post('http://api.greenweb.com.bd/api.php', greenwebsms).then(response => {
    //     console.log(response.data);
    // });
    const otp = new Otp({ number: number, otp: OTP });
    const salt = await bcrypt.genSalt(10)
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send("Otp send successfully!");
});

Router.post("/signup/verify" ,async (req, res) => {
    const otpHolder = await Otp.findAll({
        number: req.body.number
    });
    if (otpHolder.length === 0) return res.status(400).send("You use an Expired OTP!");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if (rightOtpFind.number === req.body.number && validUser) {
        const user = new User(_.pick(req.body, ["number"]));
        const token = user.generateJWT();
        const result = await user.save();
        // const OTPDelete = await Otp.deleteMany({
        //     number: rightOtpFind.number
        // });
        return res.status(200).send({
            message: "User Registration Successfull!",
            token: token,
            data: result
        });
    } else {
        return res.status(400).send("Your OTP was wrong!")
    }
});
module.exports = Router;
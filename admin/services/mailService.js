
let nodemailer = require('nodemailer');
const config = require('../config');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: config.email,
           pass: config.password
       }
});


module.exports.sendVerificationMail = (res, email, user, verificationToken) => {
    let mailOptions = {
        from : 'Lawn Application',
        to: email,
        subject: 'Account Verification for '+ user.email + 'on Lawn Application',
        text : 'Please verify your email address',
        html: `<div> Hi ${user.name} , Please <a href="http://localhost:4200/users/verifyUser?email=${email}token=${verificationToken}"> click </a> here to verify your account on Job Portal  `
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }
        // res.statusCode = 200;
        // res.setHeader('Content-Type', 'application/json');
        // res.json({success: true, status: 'Registration Successful!',isVerified: false});
        console.log('Message sent: ' + info.response);
    });
}

module.exports.sendPasswordResetMail = (user, resetToken) =>{

    
}

function sendmail(mailOptions){
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }
    });
}

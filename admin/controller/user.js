var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
global.crypto = require('crypto');
var mongooose = require('mongoose');
var mailer = require('../services/mailService');

module.exports.signup = (req, res, next) => {
    var activationToken = crypto.randomBytes(32).toString('hex'); 
    User.register(new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        verified: false,
        email: req.body.email,
        address: req.body.address,
        dob: req.body.dob,
        activationToken: activationToken
    }), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.json(err);
            return;
        }
        passport.authenticate('local')(req, res, () => {
            res.statusCode = 200; 
            res.setHeader('Content-Type', 'application/json'); 
             //mailer.sendVerificationMail(res, req.body.email, user, activationToken); 
             res.json({success: true, status: 'Registration Successful!'}); 
        });
    });
};

module.exports.login = (req, res, next) => {
    if(req.user.verified) {
        let token = authenticate.getToken({ _id: req.user._id });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({ success: true, token: token, message: 'Successfully logged in!!', user: req.user.username, id: req.user._id });
    } else {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, token: null, message: 'Please verify your email first', user: req.user.username, id: null });
    }
};

module.exports.checkJWT = (req, res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        console.log("entered");
        
        if (err)
          return next(err);
        
        if (!user) {
          console.log("User doesn't exists");
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          return res.json({status: 'JWT invalid!', success: false, err: info});
        }
        else {
          console.log("User exists");
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.json({status: 'JWT valid!', success: true, user: user});
    
        }
      }) (req, res);
};

module.exports.verifyUser = (req, res) => {
    var email = req.query.email;
    var token = req.query.token;

    User.findOne({ email: email })
    .then(user => {
        if (user.activationToken === token) {
            user.verified = true;
            user.save();
            res.json({ success: true, message: 'Verified'});
        } else {
            res.json({ success: false, message: 'Unable to verify' });
        }
    });
};

module.exports.getUsersbyAdmin = (req ,res, next) => {
    console.log(req.user._id);
    User.find({ createdBy: req.user._id })
    .skip(Number(req.query.skip))
    .limit(Number(req.query.limit))
    .then(users => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    });
};

module.exports.addUserbyAdmin = (req, res, next) => {
    var activationToken = crypto.randomBytes(32).toString('hex'); 
    User.register(new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        verified: false,
        email: req.body.email,
        address: req.body.address,
        dob: req.body.dob,
        activationToken: activationToken,
        createdBy: req.user._id
    }), req.body.password, (err, user) => {
        if (err) {
            res.statusCode = 500;
            res.json(err);
            return;
        }
        passport.authenticate('local')(req, res, () => {
            res.statusCode = 200; 
            res.setHeader('Content-Type', 'application/json'); 
            res.json({success: true, status: 'Registration Successful!'}); 
        });
    });
};

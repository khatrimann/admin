var passport = require('passport');
var User = require('./models/user');
var localStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var config = require('./config');
var extractjwt = require('passport-jwt').ExtractJwt;
var jwtStrategy = require('passport-jwt').Strategy;

exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 60*6 });
}

var opts = {};
opts.jwtFromRequest = extractjwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({ _id: jwt_payload._id}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });

exports.verifyAdmin = (req, res, next) => {
    User.findOne({ _id: req.user._id })
    .then((user) => {
        if(user.role==="admin") {
            next();
        } else {
            err = new Error('You are not authorized to perform this operation!');
            err.status = 403;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
};
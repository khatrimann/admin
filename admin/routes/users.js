var express = require('express');
var router = express.Router();
var userController = require('../controller/user');
var authenticate = require('../authenticate');
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  userController.signup(req, res, next);
});

router.get('/verify', function(req, res, next) {
  userController.verifyUser(req, res, next);
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  userController.login(req, res, next);
});

router.get('/getUsersbyAdmin', passport.authenticate('jwt'), (req, res, next) => {
  userController.getUsersbyAdmin(req, res, next);
});

router.post('/addUserbyAdmin', passport.authenticate('jwt'), (req, res, next) => {
  userController.addUserbyAdmin(req, res, next);
});

module.exports = router;

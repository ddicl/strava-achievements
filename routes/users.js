var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/auth/login', function(req, res, next) {
  res.render('login', { link: '/users/auth/strava'});
});

router.get('/auth/logout', function(req, res, next) {
  res.send("logging out");
});

router.get('/auth/strava', passport.authenticate('strava', {
  scope: ["activity:write,read"]
}));

module.exports = router;

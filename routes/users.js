var express = require('express');
var router = express.Router();
var passport = require('passport');

//logout user
router.get('/auth/logout', function(req, res, next) {
  req.logout();
  res.redirect('../../')
});

//strava auth page
router.get('/auth/strava', passport.authenticate('strava', {
  scope: ["activity:write,read"]
}));

//callback for strava auth
router.get('/auth/strava/callback', passport.authenticate('strava'), function(req, res, next) {
  res.redirect('../../../profile');
});

module.exports = router;

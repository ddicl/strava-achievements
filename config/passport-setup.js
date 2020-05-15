var passport = require('passport');
var StravaStrategy = require('passport-strava-oauth2').Strategy;
var User = require('../models/users');
require('dotenv').config();

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id).then(function(user) {
		done(null, user);
	});
});

passport.use(new StravaStrategy({
	clientID: process.env.CLIENT_ID + '&response_type=code&redirect_uri=http://localhost&approval_prompt=force',
	clientSecret: process.env.CLIENT_SECRET,//fill
	callbackURL: "http://localhost:3000/users/auth/strava/callback"
},
function(accessToken, refreshToken, profile, done) {
	User.findOne({ strava_id: profile.id }).then(function(currentUser) {
		if(currentUser) {
			console.log('User found: ' + currentUser);
			done(null, currentUser);
		} else {
			new User({
				strava_id: profile.id,
				firstname: profile._json.firstname,
				lastname: profile._json.lastname,
				profile_picture: profile._json.profile
			}).save().then(function(newUser) {
				console.log(newUser);
				done(null, newUser);
			});
		}
	})
}));


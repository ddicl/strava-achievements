var passport = require('passport');
var StravaStrategy = require('passport-strava-oauth2').Strategy;
require('dotenv').config()

passport.use(new StravaStrategy({
	clientID: process.env.CLIENT_ID + '&response_type=code&redirect_uri=http://localhost&approval_prompt=force',//fill
	clientSecret: process.env.CLIENT_SECRET,//fill
	callbackURL: "/auth/strava/callback"
},
function(accessToken, refreshToken, profile, done) {
	process.nextTick(function () {

		// To keep the example simple, the user's Strava profile is returned to
		// represent the logged-in user.  In a typical application, you would want
		// to associate the Strava account with a user record in your database,
		// and return that user instead.
		return done(null, profile);
	  });
	}
));


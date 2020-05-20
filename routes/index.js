var express = require('express');
var router = express.Router();
var passport = require('passport');
var Pr = require('../models/pr');
var User = require('../models/users');
var request = require('request');
require('dotenv').config();

var strava = require('strava-v3')
strava.config({
  "access_token"  : passport.session.accessToken,
  "client_id"     : process.env.CLIENT_ID,
  "client_secret" : process.env.CLIENT_SECRET,
  "redirect_uri"  : "http://localhost:3000/users/auth/strava/callback"
});

const pathCheck = function(req, res, next) {
	if(!req.user) {
		res.redirect('/');
	} else {
		next();
	};
};

// Retrieve new token if the current one is expired. 
const checkToken = function(req, res, next) {
	var now = new Date().getTime() / 1000;
	console.log(now);
	if(req.user.expires_at < now) {
		request.post({url:'https://www.strava.com/api/v3/oauth/token', 
		form: {
			client_id: process.env.CLIENT_ID, 
			client_secret: process.env.CLIENT_SECRET,
			grant_type: 'refresh_token',
			refresh_token: req.user.refresh_token 
		}},
		function(err, httpResponse, body) {
			if(err) {
				console.log(err);
			} else {
				let parsedBody = JSON.parse(body);
				passport.session.accessToken = parsedBody.access_token;
				User.findByIdAndUpdate(req.user.id, 
					{
						access_token: parsedBody.access_token, 
						refresh_token: parsedBody.refresh_token, 
						expires_at: parsedBody.expires_at
					},
					function(err, result) {
						if(err) {
							console.log(err);
						} else {
							console.log(result);
						}
					}
				)
			}
		});
		next();
	} else {
		console.log('Token does not need to be renewed.');
		next();
	}
}

const prCheck = function(payload) {
	var prRunObjects = [];
	for(let i = 0; i < payload.length; i++) {
		if(payload[i].pr_count != 0) {
			prRunObjects.push(payload[i]);
		}
	}
	return prRunObjects;
}

const addToPrDb = function(pr_payload) {
	return new Promise(function(resolve, reject) {
		var nonDuplicatePr = [];
		for(let i = 0; i < pr_payload.length; i++) {
			Pr.findOne({ strava_id: pr_payload[i].id }).then(function(pr) {
				if(pr) {
					console.log('Removed pr from entry list: ' + nonDuplicatePr.length);
				} else {
					new Pr({
						strava_id: pr_payload[i].id,
						pr_count: pr_payload[i].pr_count,
						user_id: pr_payload[i].athlete.id
					}).save().then(function(pr) {
						console.log('Added pr run: ' + pr);
					});
				}
			});
		}
		return resolve('done');
	});
}

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/profile', pathCheck, function(req, res, next) {
	res.render('profile', { user: req.user });
});

router.get('/updatebestefforts', checkToken, function(req, res, next) {
	var opts = { 
		'after': 0,
		'per_page': 100
	  };

	strava.client(passport.session.accessToken);
	strava.athlete.listActivities(opts, function(err, payload, limits) {
		if(!err) {
			let prObjects = prCheck(payload);
			addToPrDb(prObjects).then(function() {
				res.render('update');
			});
		} else {
			console.log(err);
		}
	});
});

router.get('/bestefforts', function(req, res, next) {
	Pr.find({ user_id: req.user.strava_id }, function(err, result) {
		if(err) {
			console.log(err);
		} else {
			res.render('bestefforts', {rows: result});
		}
	});
});
	
module.exports = router;
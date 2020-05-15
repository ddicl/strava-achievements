var express = require('express');
var router = express.Router();


const pathCheck =  function(req, res, next) {
	if(!req.user) {
		res.redirect('/');
	} else {
		next();
	};
};

router.get('/', function(req, res, next) {
	res.render('login');
});

router.get('/profile', pathCheck, function(req, res, next) {
	res.render('profile', { user: req.user });
});

module.exports = router;
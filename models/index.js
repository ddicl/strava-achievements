var mongoose = require('mongoose');
var User = require('./users');

const connectDb = () => {
	return mongoose.connect(process.env.DATABASE_URL, function() {
		console.log('connected to MongoDB');
	});
};

module.exports = connectDb;

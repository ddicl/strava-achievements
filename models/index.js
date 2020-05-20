var mongoose = require('mongoose');

const connectDb = () => {
	return mongoose.connect(process.env.DATABASE_URL, function() {
		console.log('connected to MongoDB');
	});
};

module.exports = connectDb;

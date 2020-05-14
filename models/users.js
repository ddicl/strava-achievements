var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	strava_id: {
		type: Number,
		unique: true
	},
	firstname: String,
	lastname: String,
	profile_picture: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;


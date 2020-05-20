var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	strava_id: {
		type: Number,
		unique: true
	},
	firstname: String,
	lastname: String,
	profile_picture: String,
	access_token: String,
	expires_at: Number,
	refresh_token: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;


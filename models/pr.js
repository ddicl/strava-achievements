var mongoose = require('mongoose')

const prSchema = new mongoose.Schema({
	strava_id: {
		type: Number,
		unique: true
	},
	pr_count: Number,
	user_id: Number,
	be_added: Boolean
});

const Pr = mongoose.model('Pr', prSchema);

module.exports = Pr;


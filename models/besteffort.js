var mongoose = require('mongoose');

const besteffortSchema = new mongoose.Schema({
	strava_id: {
		type: Number,
		unique: true
	},
	name: String,
	elapsed_time: Number,
	moving_time: Number,
	start_date: String, 
	distance: Number,
	pr_rank: Number,
	user_id: Number
});

const BestEffort = mongoose.model('BestEffort', besteffortSchema);

module.exports = BestEffort;
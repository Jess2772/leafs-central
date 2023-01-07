const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const playerStatsSchema = new Schema({
    _id: {type: Number, required: true},
    games_played: {type: Number, required: true},
    goals: {type: Number, required: true},
    assists: {type: Number, required: true},
    points: {type: Number, required: true},
    plus_minus: {type: Number, required: true},
    shots_on_goal: {type: Number, required: true},
    shooting_percentage: {type: Number, required: true},
    game_winning_goals: {type: Number, required: true},
    power_play_goals: {type: Number, required: true},
    power_play_assists: {type: Number, required: true},
    short_handed_goals: {type: Number, required: true},
    short_handed_assists: {type: Number, required: true},
    hits: {type: Number, required: true},
    blocked_shots: {type: Number, required: true},
    faceoff_percentage: {type: Number, required: true},
    average_toi: {type: String, required: true},
    average_pp_toi: {type: String, required: true},
    average_sh_toi: {type: String, required: true}
});

module.exports = mongoose.model("playerStats202223", playerStatsSchema);




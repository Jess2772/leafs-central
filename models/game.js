const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const gameDetailsSchema = new Schema({
    _someId: Schema.Types.ObjectId,
    home_team: {type: String, required: true},
    home_goals: {type: Number, required: true},
    away_team: {type: String, required: true},
    away_goals: {type: Number, required: true},
    date: {type: Date, required: true},
    home_scorers: [String],
    away_scorers: [String]
});

module.exports = mongoose.model("games202223", gameDetailsSchema);




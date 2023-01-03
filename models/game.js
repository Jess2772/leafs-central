const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const gameDetailsSchema = new Schema({
    game_id: {type: Number, required: true},
    game_number: {type: Number, required: true},
    home_team: {type: String, required: true},
    away_team: {type: String, required: true},
    date: {type: Date, required: true},
    overtime: {type: Boolean},
    shootout: {type: Boolean},
    home_scorers: [String],
    home_goalies: [{type: String, required:true}],
    away_scorers: [String],
    away_goalies: [{type: String, required:true}],
    highlights: {type:String}
});

module.exports = mongoose.model("games202223", gameDetailsSchema);




const mongoose = require("mongoose");

// Define a schema
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    _id: {type:Number},
    name: {type: String, required: true},
    number: {type: Number, required: true},
    position: {type: String, required: true},
});

module.exports = mongoose.model("players20222023", playerSchema);




const express = require('express');
const path = require('path');
const app = express();
const async = require('async')

const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://jboy2772:jimmyjrbestdood27@cluster27.nv3qhde.mongodb.net/nhl_library?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const hockey = require('./logic/hockey');
const Game = require('./models/game');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// route handler
app.get('/upcoming', async (req, res) => {
    // DATA FROM LIVE GAMES. CAN YOU SAVE IT? BUT ONLY IF YOURE REPEATEDLY CALLING IT....
    // each time somebody comes to the website just update it to show the live game. guess cant really save it....
    // on game day compare each teams stats? like maple leafs versus their opponent
    // let user query by game, can see info for a specific game, pull the game data from mongodb and display (try for nice graphics).
    // upcoming schedule
    // record for a certain time period? add the entries to the database... but how would i know which entries have already been saved....
    // add link for the games? but idk if thats allowed lmao
    // page for leafs news?
    // can have a dynamic endpoint that takes in a gameid, so all display games route to that one webpage?
    // when searching for a game in database, will need to associate the game with a key, like key value pair in order to find the game

    var response = await hockey.getUpcomingSchedule();
    var games = response.data.dates[0].games;
    var test = await hockey.getLeafsUpcomingSchedule();
    res.render('games.ejs', {title:"NHL DATA",games:games});

    const query = {"home_goals":3};
    const gg = Game.find(query);
    const result1 = await gg.exec();
    console.log(result1)
    
});

app.get('/team/:id', async (req, res) => {
    var teamId = req.params.id;
    var teamStats = await hockey.getTeamStats(teamId);
    res.render('teamStats.ejs', {title:"TEAM STATS/STANDINGS",teamStats:teamStats});

});


const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}`))
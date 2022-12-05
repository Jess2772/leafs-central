const express = require('express');
const path = require('path');
const axios = require('axios')
const app = express();

const hockey = require('./logic/hockey')


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
    var response = await hockey.getUpcomingSchedule();
    var games = response.data.dates[0].games;
    var test = await hockey.getLeafsUpcomingSchedule();
    console.log(test.data.totalGames);
    res.render('games.ejs', {title:"NHL DATA",games:games});

});

app.get('/team/:id', async (req, res) => {
    var teamId = req.params.id;
    var teamStats = await hockey.getTeamStats(teamId);
    res.render('teamStats.ejs', {title:"TEAM STATS/STANDINGS",teamStats:teamStats});

});


const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}`))
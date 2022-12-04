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
    var response = await hockey.getUpcomingSchedule();
    var games = response.data.dates[0].games;
    res.render('games.ejs', {title:"NHL DATA",games:games});

});

app.get('/team/:id', async (req, res) => {
    // DATA FROM LIVE GAMES. CAN YOU SAVE IT? BUT ONLY IF YOURE REPEATEDLY CALLING IT....
    // each time somebody comes to the website just update it to show the live game. guess cant really save it....
    // on game day compare each teams stats? like maple leafs versus their opponent
    var teamId = req.params.id;
    var teamStats = await hockey.getTeamStats(teamId);
    console.log(teamStats)
    res.render('teamStats.ejs', {title:"TEAM STATS/STANDINGS",teamStats:teamStats});

});


const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}`))
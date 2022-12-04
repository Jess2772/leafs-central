const express = require('express');
const path = require('path');
const axios = require('axios')
const app = express();

const hockey = require('./hockey')


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// route handler
app.get('/', async (req, res) => {
    // DATA FROM LIVE GAMES. CAN YOU SAVE IT? BUT ONLY IF YOURE REPEATEDLY CALLING IT....
    // each time somebody comes to the website just update it to show the live game. guess cant really save it....
    // on game day compare each teams stats? like maple leafs versus their opponent
    var response = await hockey.getUpcomingSchedule();
    var games = response.data.dates[0].games;
    res.render('test.ejs', {title:"NHL DATA",games:games});

});


const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}`))
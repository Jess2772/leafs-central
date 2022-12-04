const express = require('express');
const path = require('path');
const axios = require('axios')
const app = express();

const hockey = require('./hockey')


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// route handler
app.get('/', async (req, res) => {
    // axios.get("https://statsapi.web.nhl.com/api/v1/schedule", { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } }).then(
    //     (response) => {
    //         var result = response.data.dates[0].games[0].teams;
    //         // do logic here?
    //         //res.render?
    //         res.send(result)
    //     },
    //     (error) => {
    //         console.log(error);
    //     }
    // );
    // DATA FROM LIVE GAMES. CAN YOU SAVE IT? BUT ONLY IF YOURE REPEATEDLY CALLING IT....
    // each time somebody comes to the website just update it to show the live game. guess cant really save it....
    var response = await hockey.getUpcomingSchedule();
    var games = response.data.dates[0].games;
    //res.send(games);
    res.render('test.ejs', {title:"NHL DATA",games:games});

});


const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}`))
const express = require('express');
const path = require('path');
const app = express();
const async = require('async')

const mongoose = require("mongoose");
const mongoDB = "mongodb+srv://jboy2772:jimmyjrbestdood27@cluster27.nv3qhde.mongodb.net/nhl_library?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const nhl_service = require('./logic/nhlservice');
const queries = require('./queries')
const Game = require('./models/game');
const player = require('./models/player');


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(__dirname+'/public'));

var teamLogos = {
    "Anaheim Ducks": "ducks",
    "Arizona Coyotes": "coyotes",
    "Boston Bruins": "bruins",
    "Buffalo Sabres": "sabres",
    "Calgary Flames": "flames",
    "Carolina Hurricanes": "hurricanes",
    "Chicago Blackhawks": "blackhawks",
    "Dallas Stars": "stars",
    "Detroit Red Wings": "redwings",
    "Edmonton Oilers": "oilers",
    "Vegas Golden Knights": "goldenknights",
    "Los Angeles Kings": "kings",
    "Montreal Canadiens": "canadiens",
    "New Jersey Devils": "devils",
    "New York Islanders": "islanders",
    "New York Rangers": "rangers",
    "Minnesota Wild": "wild",
    "Nashville Predators": "predators",
    "Ottawa Senators": "senators",
    "Philadelphia Flyers": "flyers",
    "Pittsburgh Penguins": "penguins",
    "San Jose Sharks": "sharks",
    "Seattle Kraken": "kraken",
    "St. Louis Blues": "blues",
    "Tampa Bay Lightning": "lightning",
    "Vancouver Canucks": "canucks",
    "Washington Capitals": "capitals",
    "Winnipeg Jets": "jets"
}

// route handler
app.get('/', async (req, res) => {
    // TODO: stats page that reads data on all current players on maple leafs, and updates database. Then querydata bas and display all players because then you can sort by most points or something, need to create an object that contains all the stats you want to display. how to overwrite an entry in mongodb
    // DATA FROM LIVE GAMES. CAN YOU SAVE IT? BUT ONLY IF YOURE REPEATEDLY CALLING IT....
    // each time somebody comes to the website just update it to show the live game. guess cant really save it....
    // on game day compare each teams stats? like maple leafs versus their opponent
    // let user query by game, can see info for a specific game, pull the game data from mongodb and display (try for nice graphics).
    // page for leafs news?
    // can have a dynamic endpoint that takes in a gameid, so all display games route to that one webpage?
    // when searching for a game in database, will need to associate the game with a key, like key value pair in order to find the game

    var teamStatsResponse = await nhl_service.getTeamStats(10);  
    var teamStats = teamStatsResponse.stats[0].splits[0].stat;
    var teamStatsRanking = teamStatsResponse.stats[1].splits[0].stat;

    var upcomingGames = await nhl_service.findUpcomingGames();

    var standingStats = await nhl_service.getStandingStats();

    var isGameDay = await nhl_service.isGameDay();

    var currentDate = new Date();
    currentDate = nhl_service.formatDate(currentDate)

    res.render('games.ejs', {
            title: "Toronto Maple Leafs",
            teamStats: teamStats, 
            teamStatsRanking:teamStatsRanking,
            upcomingGames: upcomingGames,
            currentDate: currentDate,
            standingStats: standingStats,
            isGameDay: isGameDay,
            teamLogos: teamLogos
        }
    );
    

});

app.get('/team/:id', async (req, res) => {
    var teamId = req.params.id;
    var teamStats = await nhl_service.getTeamStats(teamId);
    res.render('teamStats.ejs', {title:"TEAM STATS/STANDINGS",teamStats:teamStats});

});

app.get('/pastGames', async (req, res) => {
    var pastGames = await queries.findAllPlayedGames();
    res.render('pastGames.ejs', {
            title:"Past Games", 
            pastGames:pastGames,
            teamLogos: teamLogos
        }
    );
});

app.get('/setPlayers', async (req, res) => {
    var currentRoster = await nhl_service.updateCurrentRoster(10);
});

app.get('/statistics/:position', async (req, res) => {
    var position = req.params.position;
    var playerDict = {};
    var playerInfo = await queries.findCurrentPlayers();
    for (let i = 0; i < playerInfo.length; i++) {
        playerDict[playerInfo[i]._id] = playerInfo[i]
    }
    var isGameDay = await nhl_service.isGameDay();
    if (isGameDay) {
        await nhl_service.updatePlayerStatistics();
    }
    if (position == "forwards") {
        var playerStatistics = await queries.getForwardsByPointsDescending();
        var title = "FORWARDS";
    } else if (position == "defense") {
        var playerStatistics = await queries.getDefenseByPointsDescending();
        var title = "DEFENSE";
    } else if (position == "skaters") {
        var playerStatistics = await queries.getPlayersByPointsDescending();
        var title = "SKATERS";
    }
    
    res.render('players.ejs', {
        title: title, 
        playerInfo: playerInfo,
        playerDict: playerDict,
        playerStatistics: playerStatistics
    });
});

// app.get('/statistics/defense', async (req, res) => {
//     var playerDict = {};
//     var playerInfo = await queries.findCurrentPlayers();
//     for (let i = 0; i < playerInfo.length; i++) {
//         playerDict[playerInfo[i]._id] = playerInfo[i]
//     }
//     var isGameDay = await nhl_service.isGameDay();
//     if (isGameDay) {
//         await nhl_service.updatePlayerStatistics();
//     }
//     var playerStatistics = await queries.getDefenseByPointsDescending();
//     res.render('players.ejs', {
//         title: "Defense", 
//         playerInfo: playerInfo,
//         playerDict: playerDict,
//         playerStatistics: playerStatistics
//     });
// });

const port = process.env.PORT || 8081;
app.listen(port, () => console.log(`Listening on port ${port}`))
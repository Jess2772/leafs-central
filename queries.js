const Game = require('./models/game');
const Player = require('./models/player');
const PlayerStatistics = require('./models/playerStatistics');

async function findGameById(game_id) {
    var query = {"game_id":game_id}; // this is how to query based on size of array
    var entries = Game.find(query);
    var result = await entries.exec();

}

async function findAllPlayedGames() {
    var entries = Game.find();
    var result = await entries.exec();

    return result;
}

async function findCurrentPlayers() {
    var goalies = [8476899, 8478492, 8477472];
    var query = { "_id" : { "$nin": goalies } };
    var players = Player.find(query);
    var result = await players.exec();

    return result;
}

async function getPlayersByPointsDescending() {
    var mysort = { points : -1 };
    var players = PlayerStatistics.find().sort(mysort);
    var result = await players.exec();

    return result;
}




module.exports = {
    findGameById,
    findAllPlayedGames,
    findCurrentPlayers,
    getPlayersByPointsDescending
}
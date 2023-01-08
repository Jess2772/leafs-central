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

async function getForwardsIds() {
    var forwards = ["LW", "C", "RW"]
    var query = { "position" : { "$in": forwards } };
    var mysort = { points : -1 };
    var players = Player.find(query, {_id: 1}).sort(mysort);
    var forwardIds = await players.exec();
    return forwardIds;
}

async function getDefenseIds() {
    var query = { "position" : "D" };
    var mysort = { points : -1 };
    var players = Player.find(query, {_id: 1}).sort(mysort);
    var forwardIds = await players.exec();
    return forwardIds;
}

async function getForwardsByPointsDescending() {
    var forwardIds = await getForwardsIds();
    var mysort = { points : -1 };
    var query = { "_id" : { "$in": forwardIds } };
    var players = PlayerStatistics.find(query).sort(mysort);
    var result = await players.exec();
    return result;
}

async function getDefenseByPointsDescending() {
    var defenseIds = await getDefenseIds();
    var mysort = { points : -1 };
    var query = { "_id" : { "$in": defenseIds } };
    var players = PlayerStatistics.find(query).sort(mysort);
    var result = await players.exec();
    return result;
}

module.exports = {
    findGameById,
    findAllPlayedGames,
    findCurrentPlayers,
    getPlayersByPointsDescending,
    getForwardsByPointsDescending,
    getDefenseByPointsDescending
}
const Game = require('./models/game');

async function findGameById(game_id) {
    var query = {"game_id":game_id}; // this is how to query based on size of array
    var entries = Game.find(query);
    var result = await entries.exec();
    console.log(result);

}


module.exports = {
    findGameById
}
var mongoose = require('mongoose');
var userArgs = process.argv.slice(2);
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var async = require('async')
var Game = require('./models/game')


var games = []
function gameCreate(game_id, game_number, home_team, home_goals, away_team, away_goals, date, cb) {
    gameDetail = {game_id:game_id,game_number:game_number, game_numergamehome_team:home_team , home_goals: home_goals, away_team:away_team,away_goals:away_goals, date:date};

    var game = new Game(gameDetail);
         
    game.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('New game: ' + game);
      games.push(game)
      cb(null, game)
    }  );
  }

  function createGames(cb) {
    async.series([
        function(callback) {
            gameCreate(21, 1, 'Toronto Maple Leafs', 3, 'San Jose Sharks', 1, '2022-11-17', callback);
          }
    ],cb);
  }

  async.series([
    createGames,

],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Gameinstances: '+games);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});

  
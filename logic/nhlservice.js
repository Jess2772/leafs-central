const axios = require('axios')
const async = require('async')
var moment = require('moment'); // require
moment().format(); 

const Player = require('../models/player');
const PlayerStatistics = require('../models/playerStatistics');
const queries = require('../queries')

async function getTeamStats(team_id) {
  var TEAM_STATS_ENDPOINT = `https://statsapi.web.nhl.com/api/v1/teams/${team_id}/stats`;
  var rsp = await axios.get(
    TEAM_STATS_ENDPOINT, 
    { 
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
      params: { trophies: true } 
    });
    return rsp.data;
}

async function updateCurrentRoster(team_id) {
  var PLAYER_ENDPOINT = `https://statsapi.web.nhl.com/api/v1/teams/${team_id}/roster`
  var rsp = await axios.get(
    PLAYER_ENDPOINT, 
    { 
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
      params: { trophies: true } 
    });
  rsp = rsp.data
  currentRoster = rsp.roster;
  for (let i = 0; i < currentRoster.length; i++) {
      const player = new Player({
          _id: currentRoster[i].person.id,
          name: currentRoster[i].person.fullName,
          number: currentRoster[i].jerseyNumber,
          position: currentRoster[i].position.abbreviation
      });
      player.save();
  }
}

async function updatePlayerStatistics() {
  var players = await queries.findCurrentPlayers()
  for (let i = 0; i < players.length; i++) {
    var player_id = players[i]._id;
    var PLAYER_ENDPOINT = `https://statsapi.web.nhl.com/api/v1/people/${player_id}/stats?stats=statsSingleSeason&season=20222023`
    var rsp = await axios.get(
      PLAYER_ENDPOINT, 
      { 
        headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
        params: { trophies: true } 
      });
    statLine = rsp.data.stats[0].splits[0].stat
    const playerStat = new PlayerStatistics({
      _id: player_id,
      games_played: statLine.games,
      goals: statLine.goals,
      assists: statLine.assists,
      points: statLine.points,
      plus_minus: statLine.plusMinus,
      shots_on_goal: statLine.shots,
      shooting_percentage: statLine.shotPct,
      game_winning_goals: statLine.gameWinningGoals,
      penalty_minutes: statLine.penaltyMinutes,
      power_play_goals: statLine.powerPlayGoals,
      power_play_assists: statLine.powerPlayPoints - statLine.powerPlayGoals,
      short_handed_goals: statLine.shortHandedGoals,
      short_handed_assists: statLine.shortHandedPoints - statLine.shortHandedGoals,
      hits: statLine.hits,
      blocked_shots: statLine.blocked,
      faceoff_percentage: statLine.faceOffPct,
      average_toi: statLine.timeOnIcePerGame,
      average_pp_toi: statLine.powerPlayTimeOnIcePerGame,
      average_sh_toi: statLine.shortHandedTimeOnIcePerGame
    });

    const query = { "_id": player_id };
    await PlayerStatistics.updateOne(query, {$set: playerStat}, {upsert: true});
  }
}

async function findBoxScoreByGameId(game_id) {
  var BOX_SCORE_ENDPOINT = `https://statsapi.web.nhl.com/api/v1/game/${game_id}/boxscore`;
  var rsp = await axios.get(
    BOX_SCORE_ENDPOINT, 
    { 
      headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
      params: { trophies: true } 
    });

  return rsp;
}

async function findUpcomingGames() {
  var TWO_WEEKS = 14;
  var SCHEDULE_ENDPOINT = 'https://statsapi.web.nhl.com/api/v1/schedule';
  var currentDate = new Date();
  var twoWeeksLater = new Date();

  twoWeeksLater.setDate(currentDate.getDate() + TWO_WEEKS);
  currentDate = formatDate(currentDate)
  twoWeeksLater = formatDate(twoWeeksLater)

  var rsp = await axios.get(
    SCHEDULE_ENDPOINT, 
      { 
        headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
        params: { trophies: true, teamId: 10, startDate: currentDate, endDate: twoWeeksLater } 
      }
  );
  return rsp.data.dates

}

async function getStandingStats() {
  var NUMBER_TEAMS_ATLANTIC = 8;
  var STANDINGS_ENDPOINT = 'https://statsapi.web.nhl.com/api/v1/standings/byDivision';
  var test = await axios.get(
    STANDINGS_ENDPOINT, 
      { 
        headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
        params: { trophies: true } 
      }
  )
  var atlanticStanding = test.data.records[1];
  var rsp = {}
  for (let i = 0; i < NUMBER_TEAMS_ATLANTIC; i++) {
    if (atlanticStanding.teamRecords[i].team.id == 10) {
      var rank = moment.localeData().ordinal(i + 1)
      rsp["rank"] = rank;
      rsp["streak"] = atlanticStanding.teamRecords[i].streak.streakCode;
      return rsp;
    }
  }
}

async function isGameDay() {
  var SCHEDULE_ENDPOINT = 'https://statsapi.web.nhl.com/api/v1/schedule';
  var currentDate = new Date();
  currentDate = formatDate(currentDate)

  var rsp = await axios.get(
    SCHEDULE_ENDPOINT, 
      { 
        headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
        params: { trophies: true, teamId: 10, date: currentDate } 
      }
  );
  if (rsp.data.totalItems == 1) {
    return true;
  }
  return false;
}

async function getBoxScoreForGameId(gameId) {
  var BOX_SCORE_ENDPOINT = `https://statsapi.web.nhl.com/api/v1/game/${gameId}/boxscore`
  var rsp = await axios.get(
    BOX_SCORE_ENDPOINT, 
      { 
        headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
        params: { trophies: true } 
      }
  );
  var boxscore = rsp.data;
  return boxscore;
  /*            "teamStats": {
                "teamSkaterStats": {
                    "goals": 0,
                    "pim": 9,
                    "shots": 24,
                    "powerPlayPercentage": "0.0",
                    "powerPlayGoals": 0.0,
                    "powerPlayOpportunities": 0.0,
                    "faceOffWinPercentage": "27.6",
                    "blocked": 9,
                    "takeaways": 4,
                    "giveaways": 1,
                    "hits": 26
                }
            }*/
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-')
  );
}

// save all important data from a game into database, let the user query?
module.exports = {
  getTeamStats,
  updateCurrentRoster,
  updatePlayerStatistics,
  findBoxScoreByGameId,
  findUpcomingGames,
  getStandingStats,
  getBoxScoreForGameId,
  isGameDay,
  formatDate,
  padTo2Digits
}
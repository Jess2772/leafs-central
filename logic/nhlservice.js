const axios = require('axios')
const async = require('async')
var moment = require('moment'); // require
moment().format(); 

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
    findBoxScoreByGameId,
    findUpcomingGames,
    getStandingStats,
    isGameDay,
    formatDate,
    padTo2Digits
  }
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
  var SEVEN_DAYS = 7;
  var SCHEDULE_ENDPOINT = 'https://statsapi.web.nhl.com/api/v1/schedule';
  var currentDate = new Date();
  var oneWeekLater = new Date();

  oneWeekLater.setDate(currentDate.getDate() + SEVEN_DAYS);
  currentDate = formatDate(currentDate)
  oneWeekLater = formatDate(oneWeekLater)

  var rsp = await axios.get(
    SCHEDULE_ENDPOINT, 
      { 
        headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
        params: { trophies: true, teamId: 10, startDate: currentDate, endDate: oneWeekLater } 
      }
  );
  return rsp.data.dates

}

async function getStandingInAtlantic() {
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
  for (let i = 0; i < NUMBER_TEAMS_ATLANTIC; i++) {
    if (atlanticStanding.teamRecords[i].team.id == 10) {
      var rank = moment.localeData().ordinal(i + 1)
      return rank;
    }
  }
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
    getStandingInAtlantic,
    formatDate,
    padTo2Digits
  }
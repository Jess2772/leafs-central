const axios = require('axios')

async function getUpcomingSchedule() {
    return await axios.get("https://statsapi.web.nhl.com/api/v1/schedule", { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } });
}

async function getLeafsUpcomingSchedule() {
  return await axios.get("https://statsapi.web.nhl.com/api/v1/schedule", { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true, teamId: 10, startDate: "2022-11-27", endDate: "2022-11-30"} });
}

async function getTeamStats(team_id) {
  return await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${team_id}/stats`, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } });
}

async function findBoxScoreByGameId(game_id) {
  var BOX_SCORE_ENDPOINT = `https://statsapi.web.nhl.com/api/v1/game/${game_id}/boxscore`;
  return await axios.get(BOX_SCORE_ENDPOINT, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } });
}

async function findUpcomingGames() {
  var SEVEN_DAYS = 7;
  var SCHEDULE_ENDPOINT = `https://statsapi.web.nhl.com/api/v1/schedule`;
  var currentDate = new Date();
  var oneWeekLater = new Date();

  oneWeekLater.setDate(currentDate.getDate() + SEVEN_DAYS);
  currentDate = currentDate.toISOString().substring(0,10);
  oneWeekLater = oneWeekLater.toISOString().substring(0,10);

  console.log(currentDate);
  console.log(oneWeekLater);

  return await axios.get(
    SCHEDULE_ENDPOINT, 
      { 
        headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, 
        params: { 
          trophies: true,
          teamId: 10,
          startDate: currentDate,
          endDate: oneWeekLater
        } 
      }
  )

}


// save all important data from a game into database, let the user query?



  module.exports = {
    getUpcomingSchedule,
    getTeamStats,
    getLeafsUpcomingSchedule,
    findBoxScoreByGameId,
    findUpcomingGames
  }
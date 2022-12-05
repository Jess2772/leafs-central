const axios = require('axios')

const getUpcomingSchedule = async () => {
    return await axios.get("https://statsapi.web.nhl.com/api/v1/schedule", { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } });
}

const getLeafsUpcomingSchedule = async () => {
  return await axios.get("https://statsapi.web.nhl.com/api/v1/schedule", { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true, teamId: 10, startDate: "2022-11-27", endDate: "2022-11-30"} });
}

const getTeamStats = async (id) => {
  return await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${id}/stats`, { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } });
}


// save all important data from a game into database, let the user query?
// can write a script to populate the database or do it myself?



  module.exports = {
    getUpcomingSchedule,
    getTeamStats,
    getLeafsUpcomingSchedule
  }
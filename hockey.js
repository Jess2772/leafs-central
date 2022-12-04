const axios = require('axios')

const getUpcomingSchedule = async () => {
    return await axios.get("https://statsapi.web.nhl.com/api/v1/schedule", { headers: { Accept: 'application/json', 'Accept-Encoding': 'identity' }, params: { trophies: true } });
}


  module.exports = {
    getUpcomingSchedule
  }
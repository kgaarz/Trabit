const axios = require('axios')
require('dotenv').config()

class GeodataService {
    async getCityFromGeodata(lat, long) {
        const apiString = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + lat + "%2C" + long + "%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=" + process.env.HERE_APPID + "&app_code=" + process.env.HERE_APPCODE
        const response = await axios.get(apiString)
        return response.data.Response.View[0].Result[0].Location.Address.City
    }

    async getStreetFromGeodata(lat, long) {
        const apiString = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + lat + "%2C" + long + "%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=" + process.env.HERE_APPID + "&app_code=" + process.env.HERE_APPCODE
        const response = await axios.get(apiString)
        return response.data.Response.View[0].Result[0].Location.Address.Street
    }
}

module.exports = new GeodataService()
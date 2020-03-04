const axios = require('axios');
const ApiError = require('../exceptions/apiExceptions');
require('dotenv').config();

class GeodataService {
    async getCityFromGeodata(lat, lng) {
        try {
            const apiString = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + lat + "%2C" + lng + "%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=" + process.env.HERE_APPID + "&app_code=" + process.env.HERE_APPCODE;
            const response = await axios.get(apiString);
            return response.data.Response.View[0].Result[0].Location.Address.City;
        } catch (error) {
            throw new ApiError('City could not be retrieved from the location coordinates!', 400);
        }
    }

    async getStreetFromGeodata(lat, lng) {
        try {
            const apiString = "https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + lat + "%2C" + lng + "%2C250&mode=retrieveAddresses&maxresults=1&gen=9&app_id=" + process.env.HERE_APPID + "&app_code=" + process.env.HERE_APPCODE;
            const response = await axios.get(apiString);
            return response.data.Response.View[0].Result[0].Location.Address.Street;
        } catch (error) {
            throw new ApiError('Tag could not be retrieved from the location coordinates!', 400);
        }
    }
}

module.exports = new GeodataService();
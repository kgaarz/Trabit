var apiRequestHelper = require("../apiRequestHelper");
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');
const getSwitchesHelper = require('../getSwitchesHelper');

module.exports = function (incidents, origin, destination) {
  return new Promise(function (resolve, reject) {
    apiRequestHelper.getHereDirectionsAPIData(origin, destination, "car", incidents)
      .then((data) => {
        if (!data) {
          resolve(false);
        } else {
          const metaRoute = {
            modes: ["driving"],
            duration: data.duration,
            distance: data.distance,
            switches: getSwitchesHelper(data.steps),
            sustainability: generateSustainabilityScoreHelper(data.steps),
            route: data
          }
          resolve(metaRoute);
        }
      },
        (error) => {
          reject(error);
        });
  });
}

var apiRequestHelper = require("../apiRequestHelper");
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');
const getSwitchesHelper = require('../getSwitchesHelper');

module.exports = function(incidents, origin, destination) {
  return new Promise(function(resolve, reject) {

    apiRequestHelper.getHereDirectionsAPIData(origin, destination, "publicTransportTimeTable", incidents)
      .then((data) => {
          if (!data) {
            resolve(false);
          } else {
            const metaRoute = {
              modes: ["transit"],
              duration: data.duration,
              distance: data.distance,
              switches: 2,
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

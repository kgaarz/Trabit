var apiRequestHelper = require("../apiRequestHelper");
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    apiRequestHelper.getGoogleDirectionsAPIDataWithAlternatives(origin, destination, departureTime, "bicycling")
      .then((data) => {
          var routes = [];
          if(data.length == 0) resolve(routes);

          for (i = 0; i < data.length; i++) {
            const selectionOption = {
              modes: ["bicycling"],
              duration: data[i].duration,
              distance: data[i].distance,
              switches: 0,
              sustainability: generateSustainabilityScoreHelper(data[i].steps),
              route: data[i]
            }
            routes.push(selectionOption);
          }
          resolve(routes);
        },
        (error) => {
          reject(error);
        });
  });
}

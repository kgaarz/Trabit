var apiRequestHelper = require("../apiRequestHelper");
const getSortedRoutesHelper = require('../getSortedRoutesHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
      var carWay = apiRequestHelper.getGoogleDirectionsAPIDataWithAlternatives(origin, destination, departureTime, "driving");
      var bikeWay = apiRequestHelper.getGoogleDirectionsAPIDataWithAlternatives(origin, destination, departureTime, "bicycling");

      Promise.all([carWay, bikeWay]).then((values) => {
          var routes = [];

          for (i = 0; i < values[0].length; i++) {
            const selectionOption = {
              modes: "driving",
              duration: values[0][i].duration,
              distance: values[0][i].distance,
              switches: 0,
              sustainability: 0,
              route: values[0][i]
            }
            routes.push(selectionOption);
          }
          for (i = 0; i < values[1].length; i++) {
            const selectionOption = {
              modes: "bicycling",
              duration: values[1][i].duration,
              distance: values[1][i].distance,
              switches: 0,
              sustainability: 0,
              route: values[1][i]
            }
            routes.push(selectionOption);
          }

          resolve(getSortedRoutesHelper(routes));

        },
        (error) => {
          reject(error);
        });
    },
    (error) => {
      reject(error);
    });

}

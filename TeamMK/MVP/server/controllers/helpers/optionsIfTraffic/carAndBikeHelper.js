var apiRequestHelper = require("../apiRequestHelper");
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');
const getSwitchesHelper = require('../getSwitchesHelper');

module.exports = function (incidents, origin, destination, departureTime) {
  return new Promise(function (resolve, reject) {
    var carWay = apiRequestHelper.getHereDirectionsAPIData(origin, destination, departureTime, "car", incidents);
    var bikeWay = apiRequestHelper.getHereDirectionsAPIData(origin, destination, departureTime, "bicycle", incidents);

    Promise.all([carWay, bikeWay]).then((values) => {
      var routes = [];
      const metaRouteCar = {
        modes: ["driving"],
        duration: values[0].duration,
        distance: values[0].distance,
        switches: getSwitchesHelper(values[0].steps),
        sustainability: generateSustainabilityScoreHelper(values[0].steps),
        route: values[0]
      }
      routes.push(metaRouteCar);

      const metaRouteBike = {
        modes: ["bicycling"],
        duration: values[1].duration,
        distance: values[1].distance,
        switches: getSwitchesHelper(values[1].steps),
        sustainability: generateSustainabilityScoreHelper(values[1].steps),
        route: values[1]
      }
      routes.push(metaRouteBike);

      //WARUM GEBEN WIR 2 ROUTEN ZURÜCK?
      var fastestRoute = getSortedRoutesHelper(routes);
      resolve(fastestRoute[0]);

    },
      (error) => {
        reject(error);
      });
  },
    (error) => {
      reject(error);
    });

}

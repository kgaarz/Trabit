const getSortedRoutesHelper = require('./getSortedRoutesHelper');
const apiRequestHelper = require('./apiRequestHelper');
const generateSustainabilityScoreHelper = require('./generateSustainabilityScoreHelper');
const getSwitchesHelper = require('./getSwitchesHelper');
//TODO: in alle Helper-Klassen integrieren

module.exports = {
  checkNearRoutesForTwo: function(data, firstHelper, secondHelper, origin, destination, departureTime, mode1, mode2) {
    return new Promise(function(resolve, reject) {

      var totalRoutes = [];

      totalRoutes.push(firstHelper(origin, destination, departureTime));
      totalRoutes.push(secondHelper(origin, destination, departureTime));
      for (i = 0; i < data.length; i++) {
        totalRoutes.push(createRouteforTwo(data, origin, destination, departureTime, i, mode1, mode2));
      };

      Promise.all(totalRoutes).then((values) => {
          var result = [];
          for (i = 0; i < values.length; i++) {
            for (j = 0; j < values[i].length; j++) {
              result.push(values[i][j]);
            }
          }

          for (i = 2; i < values.length; i++) {
            result.push(values[i]);
          }
          resolve(getSortedRoutesHelper(result));
        },
        (error) => {
          reject(error);
        });
    });
  }
}

function createRouteforTwo(data, origin, destination, departureTime, i, mode1, mode2) {
  return new Promise(function(resolve, reject) {
      var way1 = apiRequestHelper.getGoogleDirectionsAPIData(origin, data[i].geoLocation, departureTime, mode1);
      var way2 = apiRequestHelper.getGoogleDirectionsAPIData(data[i].geoLocation, destination, departureTime, mode2);

      Promise.all([way1, way2]).then((values) => {
          totalRoute = {
            distance: values[0].distance + values[1].distance,
            duration: values[0].duration + values[1].duration,
            startLocation: {
              lat: origin.lat,
              lng: origin.lng
            },
            endLocation: {
              lat: destination.lat,
              lng: destination.lng
            },
            steps: values[0].steps.concat(values[1].steps)
          }

          const selectionOption = {
            modes: [mode1, mode2],
            duration: totalRoute.duration,
            distance: totalRoute.distance,
            switches: getSwitchesHelper(totalRoute.steps),
            sustainability: generateSustainabilityScoreHelper(totalRoute.steps),
            route: totalRoute
          }
          resolve(selectionOption);
        },
        (error) => {
          reject(error);
        });
    },
    (error) => {
      reject(error);
    });
}

const onlyTrainTicketHelper = require('./onlyTrainTicketHelper');
const onlyCarHelper = require('./onlyCarHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const apiRequestHelper = require('../apiRequestHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');
const getSwitchesHelper = require('../getSwitchesHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {

    var trainTicketAndCarRoute = generateTrainTicketAndCarRoute(origin, destination, departureTime);
    var onlyTrainTicket = onlyTrainTicketHelper(origin, destination, departureTime);
    var onlyCar = onlyCarHelper(origin, destination, departureTime);

    Promise.all([trainTicketAndCarRoute, onlyTrainTicket, onlyCar]).then((values) => {
        var result = [];

        result.push(values[0]);
        for (i = 1; i < values.length; i++) {
          for (j = 0; j < values[i].length; j++) {
            result.push(values[i][j]);
          }
        }
        resolve(getSortedRoutesHelper(result));
      },
      (error) => {
        reject(error);
      });

  });
}

function generateTrainTicketAndCarRoute(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    apiRequestHelper.getGoogleDirectionsAPIData(origin, destination, departureTime, "transit").then((result) => {
          var value = result.steps[0].duration;
          var index = 0;
          for (i = 0; i < result.steps.length; i++) {
            if (value < result.steps[i].duration) {
              value = result.steps[i].duration;
              index = i;
            }
          }

          return checkStepsWithCar(origin, departureTime, result, index);
        },
        (error) => {
          reject(error);
        })
      .then((result) => {
          resolve(result);
        },
        (error) => {
          reject(error);
        });
  });
}

function checkStepsWithCar(origin, departureTime, result, index) {
  return new Promise(function(resolve, reject) {
    var routes = [];
    for (j = 1; j <= index; j++) {
      routes.push(apiRequestHelper.getGoogleDirectionsAPIData(origin, result.steps[j].startLocation, departureTime, "driving"));
    }
    Promise.all(routes).then((values) => {
      var shortestSteps = [];
      for (k = 0; k < values.length; k++) {
        var tempDuration = 0;
        for (m = 0; m <= k; m++) {
          tempDuration += result.steps[m].duration;
        }
        if (values[k].duration < tempDuration) {
          shortestSteps = [];
          for (n = 0; n < values[k].steps.length; n++) {
            shortestSteps.push(values[k].steps[n]);
          }
        } else {
          shortestSteps.push(result.steps[k]);
        }
      }

      for(q = index; q < result.steps.length; q++){
        shortestSteps.push(result.steps[q]);
      }

      var totalDuration = 0;
      var totalDistance = 0;

      for (p = 0; p < shortestSteps.length; p++) {
        totalDuration += shortestSteps[p].duration;
        totalDistance += shortestSteps[p].distance;
      }
      var perfectRoute = {
        modes: ["driving", "transit"],
        distance: totalDistance,
        duration: totalDuration,
        switches: getSwitchesHelper(shortestSteps),
        sustainability: generateSustainabilityScoreHelper(shortestSteps),
        route: shortestSteps
      }

      resolve(perfectRoute);
    });
  });
}

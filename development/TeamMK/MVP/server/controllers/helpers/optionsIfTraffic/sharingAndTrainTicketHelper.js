const onlyTrainTicketHelper = require('./onlyTrainTicketHelper');
const onlySharingHelper = require('./onlySharingHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const apiRequestHelper = require('../apiRequestHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');
const getSwitchesHelper = require('../getSwitchesHelper');

module.exports = function(incidents, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    var trainTicketAndCarRoute = generateTrainTicketAndCarRoute(incidents, origin, destination, departureTime);
    var onlyTrainTicket = onlyTrainTicketHelper(incidents, origin, destination);
    var onlySharing = onlySharingHelper(incidents, origin, destination, departureTime);

    Promise.all([trainTicketAndCarRoute, onlyTrainTicket, onlySharing]).then((values) => {
        var result = [];

        for (i = 0; i < values.length; i++) {
          result.push(values[i]);
        }

        var sorted = getSortedRoutesHelper(result);
        resolve(sorted[0]);
      },
      (error) => {
        reject(error);
      });

  });
}

function generateTrainTicketAndCarRoute(incidents, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    apiRequestHelper.getHereDirectionsAPIData(origin, destination, "publicTransportTimeTable", incidents).then((result) => {
          var value = result.steps[0].duration;
          var index = 0;
          for (i = 0; i < result.steps.length; i++) {
            if (value < result.steps[i].duration) {
              value = result.steps[i].duration;
              index = i;
            }
          }

          return checkStepsWithSharing(origin, incidents, result, index, departureTime);
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

function checkStepsWithSharing(origin, incidents, result, index, departureTime) {
  return new Promise(function(resolve, reject) {
    var routes = [];
    for (j = 1; j <= index; j++) {
      routes.push(onlySharingHelper(incidents, origin, result.steps[j].startLocation, departureTime));
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

      for (q = index; q < result.steps.length; q++) {
        shortestSteps.push(result.steps[q]);
      }

      var totalDuration = 0;
      var totalDistance = 0;

      for (p = 0; p < shortestSteps.length; p++) {
        totalDuration += shortestSteps[p].duration;
        totalDistance += shortestSteps[p].distance;
      }
      var perfectRoute = {
        modes: ["walking", "bicycling", "driving", "transit"],
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

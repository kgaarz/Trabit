const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const apiRequestHelper = require('../apiRequestHelper');
const onlySharingHelper = require('./onlySharingHelper');
const sharingAndCarHelper = require('./sharingAndCarHelper');
const bikeSharingAndTrainTicketHelper = require('./bikeSharingAndTrainTicketHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');
const getSwitchesHelper = require('../getSwitchesHelper');

module.exports = function(incidents, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
      var sharingAndTrainTicketAndCarRoute = generateSharingAndTrainTicketAndCarRoute(incidents, origin, destination, departureTime);
      var bikeSharingAndTrainTicket = bikeSharingAndTrainTicketHelper(incidents, origin, destination, departureTime);
      var sharingAndCar = sharingAndCarHelper(incidents, origin, destination, departureTime);

      Promise.all([sharingAndTrainTicketAndCarRoute, bikeSharingAndTrainTicket, sharingAndCar]).then((values) => {
          var result = [];


          for (i = 0; i < values.length; i++) {
              if (values[i]) result.push(values[i]);
          }

          var sorted = getSortedRoutesHelper(result);
          resolve(sorted[0]);
        },
        (error) => {
          reject(error);
        });
    },
    (error) => {
      reject(error);
    });
}

function generateSharingAndTrainTicketAndCarRoute(incidents, origin, destination, departureTime) {
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

          return checkStepsWithCar(incidents, origin, departureTime, result, index);
        },
        (error) => {
          reject(error);
        })
      .then((result) => {
          return checkStepsWithSharing(result);
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

function checkStepsWithCar(incidents, origin, departureTime, result, index) {
  return new Promise(function(resolve, reject) {
    var routes = [];
    for (j = 1; j <= index; j++) {
      routes.push(apiRequestHelper.getHereDirectionsAPIData(origin, result.steps[j].startLocation, "car", incidents));
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
      shortestSteps.push(result.steps[index]);
      var object = {
        departureTime: departureTime,
        shortestSteps: shortestSteps,
        transitRoute: result,
        index: index,
        incidents: incidents
      }
      resolve(object);

    });
  });
}

function checkStepsWithSharing(result) {
  return new Promise(function(resolve, reject) {
    var routes = [];
    for (o = result.index + 1; o < result.transitRoute.steps.length; o++) {
      routes.push(onlySharingHelper(result.incidents, result.transitRoute.steps[o].endLocation, result.transitRoute.endLocation, result.departureTime))
    }

    Promise.all(routes).then((values) => {
      var shortestSteps = [];
      var counter = 0;

      for (k = result.index + 1; k < result.transitRoute.steps.length; k++) {
        var tempDuration = 0;
        for (m = result.index + 1; m <= k; m++) {
          tempDuration += result.transitRoute.steps[m].duration;
        }
        if (!(Object.keys(values[counter]).length === 0 && values[counter].constructor === Object)) {

          if (values[counter].duration < tempDuration) {
            shortestSteps = [];
            for (n = 0; n < values[counter].steps.length; n++) {
              shortestSteps.push(values[counter].steps[n]);
            }
          } else {
            shortestSteps.push(result.transitRoute.steps[k]);
          }
        }

        counter++;
      }
      var allSteps = result.shortestSteps.concat(shortestSteps);
      var totalDuration = 0;
      var totalDistance = 0;
      for (p = 0; p < allSteps.length; p++) {
        totalDuration += allSteps[p].duration;
        totalDistance += allSteps[p].distance;
      }
      var perfectRoute = {
        modes: ["walking", "bicycling", "driving", "transit"],
        distance: totalDistance,
        duration: totalDuration,
        switches: 4,
        sustainability: generateSustainabilityScoreHelper(allSteps),
        route: allSteps
      }
      resolve(perfectRoute);

    });
  });
}

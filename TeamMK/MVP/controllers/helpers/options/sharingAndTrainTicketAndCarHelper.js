const bikeSharingAndTrainTicketHelper = require('./bikeSharingAndTrainTicketHelper');
const sharingAndCarHelper = require('./sharingAndCarHelper');
const trainTicketAndCarHelper = require('./trainTicketAndCarHelper');
const apiRequestHelper = require('../apiRequestHelper');
const onlySharingHelper = require('./onlySharingHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    generateSharingAndTrainTicketAndCarRoute(origin, destination, departureTime).then((result) => {
      resolve(result);
    })
  });
}

function generateSharingAndTrainTicketAndCarRoute(origin, destination, departureTime) {
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
          for(n = 0; n < values[k].steps.length; n++){
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
        index: index
      }
      resolve(object);

    });
  });
}

function checkStepsWithSharing(result) {
  return new Promise(function(resolve, reject) {
    var routes = [];
    for (o = result.index+1; o < result.transitRoute.steps.length; o++) {
      console.log(result.transitRoute.steps[o]);
      routes.push(onlySharingHelper(result.transitRoute.steps[o].endLocation, result.transitRoute.endLocation, result.departureTime))
    }

    Promise.all(routes).then((values) => {
      var shortestSteps = [];
      var counter = 0;
      console.log(values);
      for (k = result.index+1; k < result.transitRoute.steps.length; k++) {
        var tempDuration = 0;
        for (m = result.index+1; m <= k; m++) {
          tempDuration += result.transitRoute.steps[m].duration;
        }
        if(!(Object.keys(values[counter][0]).length === 0 && values[counter][0].constructor === Object)){

        if (values[counter][0].duration < tempDuration) {
          shortestSteps = [];
          for(n = 0; n < values[counter][0].steps.length; n++){
            shortestSteps.push(values[counter][0].steps[n]);
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
      for(p=0; p<allSteps.length; p++){
        totalDuration += allSteps[p].duration;
        totalDistance += allSteps[p].distance;
      }
      var perfectRoute = {
        distance: totalDistance,
        duration: totalDuration,
        startLocation: {
          lat: allSteps[0].startLocation.lat,
          lng: allSteps[0].startLocation.lng
        },
        endLocation: {
          lat: allSteps[allSteps.length-1].endLocation.lat,
          lng: allSteps[allSteps.length-1].endLocation.lng
        },
        steps: allSteps
      }
      resolve(perfectRoute);

    });
  });
}

const apiRequestHelper = require('../apiRequestHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    var cabData = [];
    var smallRadius = apiRequestHelper.getCabData(origin.lat, origin.lng, 200);
    var mediumRadius = apiRequestHelper.getCabData(origin.lat, origin.lng, 400);
    var bigRadius = apiRequestHelper.getCabData(origin.lat, origin.lng, 1000);

    Promise.all([smallRadius, mediumRadius, bigRadius]).then((values) => {
        if (values[0].length == 0) {
          if (values[1].length == 0) {
            if (values[2].length == 0) {
              resolve(cabData);
            } else {
              cabData = values[2];
            }
          } else {
            cabData = values[1];
          }
        } else {
          cabData = values[0];
        }
        return checkNearBikeRoutes(cabData, origin, destination, departureTime);
      }, (error)=>{
        reject(error);
      })
      .then((result) => {
        resolve(result);
      },
      (error)=>{
        reject(error);
      });
  });
}

function checkNearBikeRoutes(cabData, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    totalRoutes = [];
    for (i = 0; i < cabData.length; i++) {
      totalRoutes.push(createBikeRoute(cabData, origin, destination, departureTime, i));
    };
    Promise.all(totalRoutes).then((values) => {
      resolve(getSortedRoutesHelper(values));
    },
    (error)=>{
      reject(error);
    })
  },
  (error)=>{
    reject(error);
  });
}

function createBikeRoute(cabData, origin, destination, departureTime, i) {
  return new Promise(function(resolve, reject) {
    var walkingWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, cabData[i].geoLocation, departureTime, "walking");
    var bikeWay = apiRequestHelper.getGoogleDirectionsAPIData(cabData[i].geoLocation, destination, departureTime, "bicycling");

    Promise.all([walkingWay, bikeWay]).then((values) => {
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
        modes: ["walking", "bicycling"],
        duration: totalRoute.duration,
        distance: totalRoute.distance,
        switches: 1,
        sustainability: generateSustainabilityScoreHelper(totalRoute.steps),
        route: totalRoute
      }
      resolve(selectionOption);
    },
    (error)=>{
      reject(error);
    });
  },
  (error)=>{
    reject(error);
  });
}

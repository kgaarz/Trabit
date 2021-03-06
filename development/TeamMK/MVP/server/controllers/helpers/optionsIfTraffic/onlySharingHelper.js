const apiRequestHelper = require('../apiRequestHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');
const getSwitchesHelper = require('../getSwitchesHelper');

module.exports = function(incidents, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
      var cabData = [];
      var checkCabData = false;
      var bigRadiusBike = apiRequestHelper.getCabData(origin.lat, origin.lng, 1000);

      var flinksterData = [];
      var checkFlinksterData = false;
      var bigRadiusCar = apiRequestHelper.getFlinksterData(origin.lat, origin.lng, 2500);

      Promise.all([bigRadiusBike, bigRadiusCar]).then((values) => {
            if (values[0].length == 0) {
              checkCabData = true;
            } else {
              cabData = values[0];
            }
            if (values[1].length == 0) {
              checkFlinksterData = true;
            } else {
              flinksterData = values[1];
            }

            if (checkCabData && checkFlinksterData) {
              resolve(false);
            }

            return checkNearSharingRoutes(incidents, cabData, flinksterData, origin, destination, departureTime);
          },
          (error) => {
            reject(error);
          })
        .then((result) => {
            if (result[0].duration) {
              resolve(result[0]);
            } else {
              resolve(false);
            }
          },
          (error) => {
            reject(error);
          });
    },
    (error) => {
      reject(error);
    });
}

function checkNearSharingRoutes(incidents, cabData, flinksterData, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {

      totalRoutes = [];
      for (i = 0;
        (i < cabData.length) && (i < 3); i++) {
        totalRoutes.push(createWalkingBikeRoute(incidents, cabData, origin, destination, departureTime, i));
        for (j = 0;
          (j < flinksterData.length) && (j < 3); j++) {
          totalRoutes.push(createWalkingBikeCarRoute(incidents, cabData, flinksterData, origin, destination, departureTime, i, j));
        }
      };

      for (i = 0;
        (i < flinksterData.length) && (i < 3); i++) {
        totalRoutes.push(createWalkingCarRoute(incidents, flinksterData, origin, destination, departureTime, i));
      };

      Promise.all(totalRoutes).then((values) => {
          resolve(getSortedRoutesHelper(values));
        },
        (error) => {
          reject(error);
        })
    },
    (error) => {
      reject(error);
    });
}

function createWalkingBikeRoute(incidents, cabData, origin, destination, departureTime, i) {
  return new Promise(function(resolve, reject) {
      var walkingWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, cabData[i].geoLocation, departureTime, "walking");
      var bikeWay = apiRequestHelper.getHereDirectionsAPIData(cabData[i].geoLocation, destination, "bicycle", incidents);

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
        (error) => {
          reject(error);
        });
    },
    (error) => {
      reject(error);
    });
}

function createWalkingBikeCarRoute(incidents, cabData, flinksterData, origin, destination, departureTime, i, j) {
  return new Promise(function(resolve, reject) {
      var walkingWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, cabData[i].geoLocation, departureTime, "walking");
      var bikeWay = apiRequestHelper.getHereDirectionsAPIData(cabData[i].geoLocation, flinksterData[j].geoLocation, "bicycle", incidents);
      var carWay = apiRequestHelper.getHereDirectionsAPIData(flinksterData[j].geoLocation, destination, "car", incidents);

      Promise.all([walkingWay, bikeWay, carWay]).then((values) => {
          if (values[0] && values[1] && values[2]) {
            totalRoute = {
              distance: values[0].distance + values[1].distance + values[2].distance,
              duration: values[0].duration + values[1].duration + values[2].duration,
              startLocation: {
                lat: origin.lat,
                lng: origin.lng
              },
              endLocation: {
                lat: destination.lat,
                lng: destination.lng
              },
              steps: values[0].steps.concat(values[1].steps.concat(values[2].steps))
            }

            const selectionOption = {
              modes: ["walking", "bicycling", "driving"],
              duration: totalRoute.duration,
              distance: totalRoute.distance,
              switches: 2,
              sustainability: generateSustainabilityScoreHelper(totalRoute.steps),
              route: totalRoute
            }
            resolve(selectionOption);
          } else {
            resolve(false);
          }
        },
        (error) => {
          reject(error);
        });
    },
    (error) => {
      reject(error);
    });
}

function createWalkingCarRoute(incidents, flinksterData, origin, destination, departureTime, i) {
  return new Promise(function(resolve, reject) {
      var walkingWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, flinksterData[i].geoLocation, departureTime, "walking");
      var carWay = apiRequestHelper.getHereDirectionsAPIData(flinksterData[i].geoLocation, destination, "car", incidents);

      Promise.all([walkingWay, carWay]).then((values) => {
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
            modes: ["walking", "driving"],
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

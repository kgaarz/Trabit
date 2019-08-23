const apiRequestHelper = require('../apiRequestHelper');
const onlySharingHelper = require('./onlySharingHelper');
const onlyBikeHelper = require('./onlyBikeHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');


module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    var flinksterData = [];
    var smallRadiusCar = apiRequestHelper.getFlinksterData(origin.lat, origin.lng, 500);
    var mediumRadiusCar = apiRequestHelper.getFlinksterData(origin.lat, origin.lng, 1250);
    var bigRadiusCar = apiRequestHelper.getFlinksterData(origin.lat, origin.lng, 2500);

    Promise.all([smallRadiusCar, mediumRadiusCar, bigRadiusCar]).then((values) => {
          if (values[0].length == 0) {
            if (values[1].length == 0) {
              if (values[2].length == 0) {
                reject("error: No Carsharing found");
              } else {
                flinksterData = values[2];
              }
            } else {
              flinksterData = values[1];
            }
          } else {
            flinksterData = values[0];
          }
          return checkNearSharingAndBikeRoutes(flinksterData, origin, destination, departureTime);
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

function checkNearSharingAndBikeRoutes(flinksterData, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
      var totalRoutes = [];

      totalRoutes.push(onlySharingHelper(origin, destination, departureTime));
      totalRoutes.push(onlyBikeHelper(origin, destination, departureTime));
      for (i = 0; i < flinksterData.length; i++) {
        totalRoutes.push(ownBikeAndCarSharing(flinksterData, origin, destination, departureTime, i));
      };

      Promise.all(totalRoutes).then((values) => {
        var result = [];
        result.push(values[0][0]);
        result.push(values[0][1]);
        result.push(values[1][0]);
        result.push(values[1][1]);
        for (i = 2; i < values.length; i++) {
          result.push(values[i]);
        }
        resolve(getSortedRoutesHelper(result));
      })
    },
    (error) => {
      reject(error);
    });
}

function ownBikeAndCarSharing(flinksterData, origin, destination, departureTime, i) {
  return new Promise(function(resolve, reject) {
      var bikeWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, flinksterData[i].geoLocation, departureTime, "bicycling");
      var carWay = apiRequestHelper.getGoogleDirectionsAPIData(flinksterData[i].geoLocation, destination, departureTime, "driving");
      var totalRoute;

      Promise.all([bikeWay, carWay]).then((values) => {
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
            modes: ["bicycling", "driving"],
            duration: totalRoute.duration,
            distance: totalRoute.distance,
            switches: 1,
            sustainability: 0,
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

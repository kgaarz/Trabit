const apiRequestHelper = require('../apiRequestHelper');
const onlySharingHelper = require('./onlySharingHelper');
const onlyBikeHelper = require('./onlyBikeHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const checkNearRoutesHelper = require('../checkNearRoutesHelper');


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
          return checkNearRoutesHelper.checkNearRoutesForTwo(flinksterData, onlySharingHelper, onlyBikeHelper, origin, destination, departureTime, "bicycling", "driving");
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

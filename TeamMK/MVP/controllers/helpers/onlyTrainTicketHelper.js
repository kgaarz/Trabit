var apiRequestHelper = require("./apiRequestHelper");

module.exports = function (origin, destination, departureTime) {
  return new Promise(function (resolve, reject) {
    var hereData = [];
    var smallRadius = apiRequestHelper.getHereData(origin.lat, origin.lng, 200);
    var mediumRadius = apiRequestHelper.getHereData(origin.lat, origin.lng, 400);
    var bigRadius = apiRequestHelper.getHereData(origin.lat, origin.lng, 1000);

    Promise.all([smallRadius, mediumRadius, bigRadius]).then((values) => {
      if (values[0].length == 0) {
        if (values[1].length == 0) {
          if (values[2].length == 0) {
            reject("error: No Train found");
          } else {
            hereData = values[2];
          }
        } else {
          hereData = values[1];
        }
      } else {
        hereData = values[0];
      }
      return checkNearTrainRoutes(hereData, origin, destination, departureTime);
    }, (error) => {
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

function checkNearTrainRoutes(hereData, origin, destination, departureTime) {
  return new Promise(function (resolve, reject) {
    totalRoutes = [];
    for (i = 0; i < hereData.length; i++) {
      totalRoutes.push(createTrainRoute(hereData, origin, destination, departureTime, i));
    };
    Promise.all(totalRoutes).then((values) => {
      var shortestRoute, tmp;
      var lowest = Number.POSITIVE_INFINITY;
      for (var i = values.length - 1; i >= 0; i--) {
        tmp = values[i].duration;
        if (tmp < lowest) {
          lowest = tmp;
          shortestRoute = values[i];
        }
      }
      const selectionOption = {
        modes: ["walking", "transit"],
        duration: shortestRoute.duration,
        distance: shortestRoute.distance,
        switches: 1,
        sustainability: 0,
        route: shortestRoute
      }
      resolve(selectionOption);
    },
      (error) => {
        reject(error);
      })
  },
    (error) => {
      reject(error);
    });
}

function createTrainRoute(hereData, origin, destination, departureTime, i) {
  return new Promise(function (resolve, reject) {
    var walkingWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, hereData[i].geoLocation, departureTime, "walking");
    var trainWay = apiRequestHelper.getGoogleDirectionsAPIData(hereData[i].geoLocation, destination, departureTime, "transit");

    Promise.all([walkingWay, trainWay]).then((values) => {
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
      resolve(totalRoute);
    },
      (error) => {
        reject(error);
      });
  },
    (error) => {
      reject(error);
    });
}








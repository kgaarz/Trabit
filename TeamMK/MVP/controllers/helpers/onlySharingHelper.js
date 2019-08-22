const apiRequestHelper = require('./apiRequestHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    var cabData = [];
    var smallRadiusBike = apiRequestHelper.getCabData(origin.lat, origin.lng, 200);
    var mediumRadiusBike = apiRequestHelper.getCabData(origin.lat, origin.lng, 400);
    var bigRadiusBike = apiRequestHelper.getCabData(origin.lat, origin.lng, 1000);

    var flinksterData = [];
    var smallRadiusCar = apiRequestHelper.getFlinksterData(origin.lat, origin.lng, 500);
    var mediumRadiusCar = apiRequestHelper.getFlinksterData(origin.lat, origin.lng, 1250);
    var bigRadiusCar = apiRequestHelper.getFlinksterData(origin.lat, origin.lng, 2500);

    Promise.all([smallRadiusBike, mediumRadiusBike, bigRadiusBike, smallRadiusCar, mediumRadiusCar, bigRadiusCar]).then((values) => {
        if (values[0].length == 0) {
          if (values[1].length == 0) {
            if (values[2].length == 0) {
              reject("error: No Bikesharing found");
            } else {
              cabData = values[2];
            }
          } else {
            cabData = values[1];
          }
        } else {
          cabData = values[0];
        }
        if (values[3].length == 0) {
          if (values[4].length == 0) {
            if (values[5].length == 0) {
              reject("error: No Carsharing found");
            } else {
              flinksterData = values[5];
            }
          } else {
            flinksterData = values[4];
          }
        } else {
          flinksterData = values[3];
        }

        return checkNearSharingRoutes(cabData, flinksterData, origin, destination, departureTime);
      },
      (error)=>{
        reject(error);
      })
      .then((result) => {
        resolve(result);
      },
      (error)=>{
        reject(error);
      });
  },
  (error)=>{
    reject(error);
  });
}

function checkNearSharingRoutes(cabData, flinksterData, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    totalRoutes = [];
    for (i = 0; i < cabData.length; i++) {
      totalRoutes.push(createWalkingBikeRoute(cabData, origin, destination, departureTime, i));
      for (j = 0; j < flinksterData.length; j++) {
        totalRoutes.push(createWalkingBikeCarRoute(cabData, flinksterData, origin, destination, departureTime, i, j));
      }
    };

    for (i = 0; i < flinksterData.length; i++) {
      totalRoutes.push(createWalkingCarRoute(flinksterData, origin, destination, departureTime, i));
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
      resolve(shortestRoute);
    },
    (error)=>{
      reject(error);
    })
  },
  (error)=>{
    reject(error);
  });
}

function createWalkingBikeRoute(cabData, origin, destination, departureTime, i) {
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
        sustainability: 0,
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

function createWalkingBikeCarRoute(cabData, flinksterData, origin, destination, departureTime, i, j) {
  return new Promise(function(resolve, reject) {
    var walkingWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, cabData[i].geoLocation, departureTime, "walking");
    var bikeWay = apiRequestHelper.getGoogleDirectionsAPIData(cabData[i].geoLocation, flinksterData[j].geoLocation, departureTime, "bicycling");
    var carWay = apiRequestHelper.getGoogleDirectionsAPIData(flinksterData[j].geoLocation, destination, departureTime, "driving");

    Promise.all([walkingWay, bikeWay, carWay]).then((values) => {
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
        sustainability: 0,
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

function createWalkingCarRoute(flinksterData, origin, destination, departureTime, i) {
  return new Promise(function(resolve, reject) {
    var walkingWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, flinksterData[i].geoLocation, departureTime, "walking");
    var carWay = apiRequestHelper.getGoogleDirectionsAPIData(flinksterData[i].geoLocation, destination, departureTime, "driving");

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
        switches: 1,
        sustainability: 0,
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

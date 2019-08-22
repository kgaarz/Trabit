const dataController = require('../dataController');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    var cabData = [];
    var smallRadius = dataController.getCabData(origin.lat, origin.lng, 200);
    var mediumRadius = dataController.getCabData(origin.lat, origin.lng, 400);
    var bigRadius = dataController.getCabData(origin.lat, origin.lng, 1000);

    Promise.all([smallRadius, mediumRadius, bigRadius]).then((values) => {
        if (values[0].length == 0) {
          if (values[1].length == 0) {
            if (values[2].length == 0) {
              console.log("Keine Fahrräder gefunden");
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
      })
      .then((result) => {
        resolve(result);
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
        modes: ["walking", "bicycling"],
        duration: shortestRoute.duration,
        distance: shortestRoute.distance,
        switches: 1,
        sustainability: 0,
        route: shortestRoute
      }
      resolve(selectionOption);
    })
  });
}

function createBikeRoute(cabData, origin, destination, departureTime, i) {
  return new Promise(function(resolve, reject) {
    var walkingWay = dataController.getGoogleDirectionsAPIData(origin, cabData[i].geoLocation, departureTime, "walking");
    var bikeWay = dataController.getGoogleDirectionsAPIData(cabData[i].geoLocation, destination, departureTime, "bicycle");

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
      resolve(totalRoute);
    });
  });
}

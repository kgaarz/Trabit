var apiRequestHelper = require("../apiRequestHelper");

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    apiRequestHelper.getGoogleDirectionsAPIDataWithAlternatives(origin, destination, departureTime, "bicycling")
      .then((data) => {
          var routes = [];
          if(data.length == 0) resolve(routes);

          for (i = 0; i < data.length; i++) {
            const selectionOption = {
              modes: ["bicycling"],
              duration: data[i].duration,
              distance: data[i].distance,
              switches: 0,
              sustainability: 0,
              route: data[i]
            }
            routes.push(selectionOption);
          }
          resolve(routes);
        },
        (error) => {
          reject(error);
        });
  });
}

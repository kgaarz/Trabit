var apiRequestHelper = require("./apiRequestHelper");

module.exports = function(origin, destination, departureTime) {
    return new Promise(function(resolve, reject) {
        apiRequestHelper.getGoogleDirectionsAPIData(origin, destination, departureTime, "driving")
        .then((data) =>{
            const selectionOption = {
                modes: ["driving"],
                duration: data.duration,
                distance: data.distance,
                switches: 0,
                sustainability: 0,
                route: data
              }
              resolve(selectionOption);
        },
        (error)=>{
          reject(error);
        });
    });
}
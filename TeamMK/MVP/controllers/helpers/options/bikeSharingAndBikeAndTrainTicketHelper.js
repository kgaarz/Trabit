const onlyBikeHelper = require('./onlyBikeHelper');
const onlyTrainTicketHelper = require('./onlyTrainTicketHelper');
const apiRequestHelper = require('../apiRequestHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {

      var hereData = [];
      var smallRadiusTrainTicket = apiRequestHelper.getHereData(origin.lat, origin.lng, 500);
      var mediumRadiusTrainTicket = apiRequestHelper.getHereData(origin.lat, origin.lng, 1250);
      var bigRadiusTrainTicket = apiRequestHelper.getHereData(origin.lat, origin.lng, 2500);

      Promise.all([smallRadiusTrainTicket, mediumRadiusTrainTicket, bigRadiusTrainTicket]).then((values) => {
            if (values[0].length == 0) {
              if (values[1].length == 0) {
                if (values[2].length == 0) {
                  hereData = [];
                } else {
                  hereData = values[2];
                }
              } else {
                hereData = values[1];
              }
            } else {
              hereData = values[0];
            }
            return checkNearBikeAndTrainTicketRoutes(hereData, origin, destination, departureTime);
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
    },
    (error) => {
      reject(error);
    });
}

function checkNearBikeAndTrainTicketRoutes(hereData, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
      totalRoutes = [];

      totalRoutes.push(onlyBikeHelper(origin, destination, departureTime));
      totalRoutes.push(onlyTrainTicketHelper(origin, destination, departureTime));

      for (i = 0; i < hereData.length; i++) {
        totalRoutes.push(createNearBikeAndTrainTicketRoutes(hereData, origin, destination, departureTime, i));
      }

      Promise.all(totalRoutes).then((values) => {
          //console.log(values);
          var result = [];
          for (i = 0; i < values.length; i++) {
            for (j = 0; j < values[i].length; j++) {
              result.push(values[i][j]);
            }
          }
          for (i = 2; i < values.length; i++) {
            result.push(values[i]);
          }
          resolve(getSortedRoutesHelper(result));
        },
        (error) => {
          reject(error);
        })
    },
    (error) => {
      reject(error);
    });
}

function createNearBikeAndTrainTicketRoutes(hereData, origin, destination, departureTime, i) {
  return new Promise(function(resolve, reject) {
      var bikeWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, hereData[i].geoLocation, departureTime, "bicycling");
      var transitWay = apiRequestHelper.getGoogleDirectionsAPIData(hereData[i].geoLocation, destination, departureTime, "transit");

      Promise.all([bikeWay, transitWay]).then((values) => {
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
            modes: ["bicycling", "transit"],
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

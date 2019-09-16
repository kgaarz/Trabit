const onlyBikeHelper = require('./onlyBikeHelper');
const onlyTrainTicketHelper = require('./onlyTrainTicketHelper');
const apiRequestHelper = require('../apiRequestHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');
const getSwitchesHelper = require('../getSwitchesHelper');

module.exports = function(incidents, origin, destination) {
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
            return checkNearBikeAndTrainTicketRoutes(hereData, origin, destination, incidents);
          },
          (error) => {
            reject(error);
          })
        .then((result) => {
            resolve(result[0]);
          },
          (error) => {
            reject(error);
          });
    },
    (error) => {
      reject(error);
    });
}

function checkNearBikeAndTrainTicketRoutes(hereData, origin, destination, incidents) {
  return new Promise(function(resolve, reject) {
      totalRoutes = [];

      totalRoutes.push(onlyBikeHelper(incidents, origin, destination));
      totalRoutes.push(onlyTrainTicketHelper(incidents, origin, destination));

      for (i = 0; i < hereData.length; i++) {
        totalRoutes.push(createNearBikeAndTrainTicketRoutes(hereData, origin, destination, incidents, i));
      }

      Promise.all(totalRoutes).then((values) => {
          var result = [];
          for (i = 0; i < values.length; i++) {
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

function createNearBikeAndTrainTicketRoutes(hereData, origin, destination, incidents, i) {
  return new Promise(function(resolve, reject) {
      var bikeWay = apiRequestHelper.getHereDirectionsAPIData(origin, hereData[i].geoLocation, "bicycle", incidents);
      var transitWay = apiRequestHelper.getHereDirectionsAPIData(hereData[i].geoLocation, destination, "publicTransportTimeTable", incidents);

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

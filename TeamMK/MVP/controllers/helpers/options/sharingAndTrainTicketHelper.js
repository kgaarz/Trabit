const onlySharingHelper = require('./onlySharingHelper');
const onlyTrainTicketHelper = require('./onlyTrainTicketHelper');
const apiRequestHelper = require('../apiRequestHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const generateSustainabilityScoreHelper = require('../generateSustainabilityScoreHelper');
const getSwitchesHelper = require('../getSwitchesHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
      var cabData = [];
      var smallRadiusBike = apiRequestHelper.getCabData(origin.lat, origin.lng, 200);
      var mediumRadiusBike = apiRequestHelper.getCabData(origin.lat, origin.lng, 400);
      var bigRadiusBike = apiRequestHelper.getCabData(origin.lat, origin.lng, 1000);

      var hereData = [];
      var smallRadiusTrainTicket = apiRequestHelper.getHereData(origin.lat, origin.lng, 500);
      var mediumRadiusTrainTicket = apiRequestHelper.getHereData(origin.lat, origin.lng, 1250);
      var bigRadiusTrainTicket = apiRequestHelper.getHereData(origin.lat, origin.lng, 2500);

      Promise.all([smallRadiusBike, mediumRadiusBike, bigRadiusBike, smallRadiusTrainTicket, mediumRadiusTrainTicket, bigRadiusTrainTicket]).then((values) => {
            if (values[0].length == 0) {
              if (values[1].length == 0) {
                if (values[2].length == 0) {
                  console.log("Keine CabData gefunden: es wird nur eine Transit-Route erstellt")
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
                  reject("error: No Transit-Stations found");
                } else {
                  hereData = values[5];
                }
              } else {
                hereData = values[4];
              }
            } else {
              hereData = values[3];
            }
            return checkNearSharingAndTrainTicketRoutes(cabData, hereData, origin, destination, departureTime);
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

function checkNearSharingAndTrainTicketRoutes(cabData, hereData, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
      totalRoutes = [];

      totalRoutes.push(onlySharingHelper(origin, destination, departureTime));
      totalRoutes.push(onlyTrainTicketHelper(origin, destination, departureTime));

      for (i = 0; i < cabData.length; i++) {
        for (j = 0; j < hereData.length; j++) {
          totalRoutes.push(createNearSharingAndTrainTicketRoutes(cabData, hereData, origin, destination, departureTime, i, j));
        }
      };

      Promise.all(totalRoutes).then((values) => {

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

function createNearSharingAndTrainTicketRoutes(cabData, hereData, origin, destination, departureTime, i, j) {
  return new Promise(function(resolve, reject) {
      var sharingWay = onlySharingHelper(origin, hereData[i].geoLocation, departureTime)
      var transitWay = apiRequestHelper.getGoogleDirectionsAPIData(hereData[j].geoLocation, destination, departureTime, "transit");
      console.log("jo");
      Promise.all([sharingWay, transitWay]).then((values) => {
          console.log(values);
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
            modes: ["walking", "bicycling", "driving", "transit"],
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

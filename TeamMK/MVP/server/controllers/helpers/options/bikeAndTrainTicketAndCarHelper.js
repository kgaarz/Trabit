const trainTicketAndBikeHelper = require('./trainTicketAndBikeHelper');
const carAndBikeHelper = require('./carAndBikeHelper');
const trainTicketAndCarHelper = require('./trainTicketAndCarHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    var trainTicketAndBikeWay = trainTicketAndBikeHelper(origin, destination, departureTime);
    var carAndBikeWay = carAndBikeHelper(origin, destination, departureTime);
    var trainTicketAndCarWay = trainTicketAndCarHelper(origin, destination, departureTime);

    Promise.all([trainTicketAndBikeWay, carAndBikeWay, trainTicketAndCarWay]).then((values) => {
      var result = [];
      for (i = 0; i < values.length; i++) {
        for (j = 0; j < values[i].length; j++) {
          result.push(values[i][j]);
        }
      }
      resolve(getSortedRoutesHelper(result));
    },
    (error) => {
      reject(error);
    });
  });
}

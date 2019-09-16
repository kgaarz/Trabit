const getSortedRoutesHelper = require('../getSortedRoutesHelper');
const sharingAndCarHelper = require('./sharingAndCarHelper');
const bikeSharingAndBikeAndTrainTicketHelper = require('./bikeSharingAndBikeAndTrainTicketHelper');
const sharingAndTrainTicketAndCarHelper = require('./sharingAndTrainTicketAndCarHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
      // TODO: Kann der Server auf einem unserer Laptops diese Requests aushalten?
      var sharingAndTrainTicketAndCar = sharingAndTrainTicketAndCarHelper(origin, destination, departureTime);
      var bikeSharingAndBikeAndTrainTicket = bikeSharingAndBikeAndTrainTicketHelper(origin, destination, departureTime);

      Promise.all([sharingAndTrainTicketAndCar, bikeSharingAndBikeAndTrainTicket]).then((values) => {
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
    },
    (error) => {
      reject(error);
    });
}

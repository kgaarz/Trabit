const checkMobilityOptionsController = require('./checkMobilityOptionsController');
const onlyBikeSharingHelper = require('./helpers/onlyBikeSharingHelper');

module.exports = {
  generateRoute: function(availableMobilityOptions, origin, destination, departureTime) {
    return new Promise(function(resolve, reject) {
      if (checkMobilityOptionsController.onlyBikeSharing(availableMobilityOptions)) {
        onlyBikeSharingHelper(origin, destination, departureTime).then(function(result) {
          resolve(result);
        });
      }
      if (checkMobilityOptionsController.onlySharing(availableMobilityOptions)) {

      }
    });
  }
}

const checkMobilityOptionsHelper = require('./checkMobilityOptionsHelper');
const onlyBikeSharingHelper = require('./onlyBikeSharingHelper');

module.exports = {
  generateRoute: function(availableMobilityOptions, origin, destination, departureTime) {
    return new Promise(function(resolve, reject) {
      if (checkMobilityOptionsHelper.onlyBikeSharing(availableMobilityOptions)) {
        onlyBikeSharingHelper(origin, destination, departureTime).then(function(result) {
          resolve(result);
        });
      }
      if (checkMobilityOptionsHelper.onlySharing(availableMobilityOptions)) {

      }
    });
  }
}

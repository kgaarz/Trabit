const checkMobilityOptionsHelper = require('./checkMobilityOptionsHelper');
const onlyBikeSharingHelper = require('./onlyBikeSharingHelper');
const onlySharingHelper = require('./onlySharingHelper');

module.exports = function(availableMobilityOptions, origin, destination, departureTime) {
    return new Promise(function(resolve, reject) {
        if (checkMobilityOptionsHelper.onlyBikeSharing(availableMobilityOptions)) {
          onlyBikeSharingHelper(origin, destination, departureTime).then(function(result) {
            resolve(result);
          }, (error) => {
            reject(error);
          });
        }
        if (checkMobilityOptionsHelper.onlySharing(availableMobilityOptions)) {
          onlySharingHelper(origin, destination, departureTime).then(function(result) {
            resolve(result);
          }, (error) => {
            reject(error);
          });
        }
        if(checkMobilityOptionsHelper.noOptions(availableMobilityOptions)){
          reject("error: The route could not be generated because the specified MobilityOptions do not match the cases.");
        }
      });
    }
  
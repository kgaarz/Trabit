const onlySharingHelper = require('./onlySharingHelper');
const onlyCarHelper = require('./onlyCarHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');

module.exports = function(incidents, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {

    var onlySharing = onlySharingHelper(incidents, origin, destination, departureTime);
    var onlyCar = onlyCarHelper(incidents, origin, destination);

    Promise.all([onlySharing, onlyCar]).then((values) => {
        var result = [];

        for(i=0; i<values.length; i++){
            result.push(values[i]);
        }
        
        var sorted = getSortedRoutesHelper(result);
        resolve(sorted[0]);
      },
      (error) => {
        reject(error);
      });

  });
}

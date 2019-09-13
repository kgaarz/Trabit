const onlySharingHelper = require('./onlySharingHelper');
const onlyCarHelper = require('./onlyCarHelper');
const getSortedRoutesHelper = require('../getSortedRoutesHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {

    var onlySharing = onlySharingHelper(origin, destination, departureTime);
    var onlyCar = onlyCarHelper(origin, destination, departureTime);

    Promise.all([onlySharing, onlyCar]).then((values) => {
        var result = [];
        
        for(i=0; i<values.length; i++){
          for(j=0; j<values[i].length; j++){
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

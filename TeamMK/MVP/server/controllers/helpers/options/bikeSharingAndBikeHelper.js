const onlyBikeHelper = require('./onlyBikeHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    onlyBikeHelper(origin, destination, departureTime).then(
      (result) => {
        resolve(result);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

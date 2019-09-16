const onlyBikeHelper = require('./onlyBikeHelper');

module.exports = function(incidents, origin, destination) {
  return new Promise(function(resolve, reject) {
    onlyBikeHelper(incidents, origin, destination).then(
      (result) => {
        resolve(result);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

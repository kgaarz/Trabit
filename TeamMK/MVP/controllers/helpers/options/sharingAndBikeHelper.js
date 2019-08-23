var apiRequestHelper = require("../apiRequestHelper");
var onlySharing = require("./onlySharingHelper");

module.exports = function (origin, destination, departureTime) {
    return new Promise(function (resolve, reject) {
        onlySharing(origin,destination,departureTime);



    });

}

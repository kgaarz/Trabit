const apiRequestHelper = require('../apiRequestHelper');
const onlyBikeHelper = require('./onlyBikeHelper');
const onlyTrainTicketHelper = require('./onlyTrainTicketHelper');
const checkNearRoutesHelper = require('../checkNearRoutesHelper');

module.exports = function (origin, destination, departureTime) {
    return new Promise(function (resolve, reject) {
        var hereData = [];
        var smallRadiusCar = apiRequestHelper.getHereData(origin.lat, origin.lng, 500);
        var mediumRadiusCar = apiRequestHelper.getHereData(origin.lat, origin.lng, 1250);
        var bigRadiusCar = apiRequestHelper.getHereData(origin.lat, origin.lng, 2500);

        Promise.all([smallRadiusCar, mediumRadiusCar, bigRadiusCar]).then((values) => {
            if (values[0].length == 0) {
                if (values[1].length == 0) {
                    if (values[2].length == 0) {
                        reject("error: No train found");
                    } else {
                        hereData = values[2];
                    }
                } else {
                    hereData = values[1];
                }
            } else {
                hereData = values[0];
            }
            return checkNearRoutesHelper.checkNearRoutesForTwo(hereData, onlyBikeHelper, onlyTrainTicketHelper, origin, destination, departureTime, "bicycling", "transit");
        },
            (error) => {
                reject(error);
            })
            .then((result) => {
                resolve(result);
            },
                (error) => {
                    reject(error);

                });

    });
}

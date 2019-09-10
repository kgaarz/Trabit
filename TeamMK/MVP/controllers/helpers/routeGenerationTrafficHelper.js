const checkMobilityOptionsHelper = require('./checkMobilityOptionsHelper');
const onlyBikeSharingHelper = require('./optionsIfTraffic/onlyBikeSharingHelper');
const onlySharingHelper = require('./optionsIfTraffic/onlySharingHelper');
const onlyCarHelper = require('./optionsIfTraffic/onlyCarHelper');
const onlyBikeHelper = require('./optionsIfTraffic/onlyBikeHelper');
const onlyTrainTicketHelper = require('./optionsIfTraffic/onlyTrainTicketHelper');
const carAndBikeHelper = require('./optionsIfTraffic/carAndBikeHelper');
const sharingAndBikeHelper = require('./optionsIfTraffic/sharingAndBikeHelper');
const bikeSharingAndBikeHelper = require('./optionsIfTraffic/bikeSharingAndBikeHelper');
const trainTicketAndBikeHelper = require('./optionsIfTraffic/trainTicketAndBikeHelper');
const sharingAndCarHelper = require('./optionsIfTraffic/sharingAndCarHelper');
const trainTicketAndCarHelper = require('./optionsIfTraffic/trainTicketAndCarHelper');
const bikeSharingAndTrainTicketHelper = require('./optionsIfTraffic/bikeSharingAndTrainTicketHelper');
const bikeAndTrainTicketAndCarHelper = require('./optionsIfTraffic/bikeAndTrainTicketAndCarHelper');
const sharingAndTrainTicketAndCarHelper = require('./optionsIfTraffic/sharingAndTrainTicketAndCarHelper');
const sharingAndBikeAndCarHelper = require('./optionsIfTraffic/sharingAndBikeAndCarHelper');
const bikeSharingAndBikeAndTrainTicketHelper = require('./optionsIfTraffic/bikeSharingAndBikeAndTrainTicketHelper');
const sharingAndTrainTicketHelper = require('./optionsIfTraffic/sharingAndTrainTicketHelper');
const allOptionsHelper = require('./optionsIfTraffic/allOptionsHelper');

module.exports = function(availableMobilityOptions, incidents, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    if (checkMobilityOptionsHelper.onlyBikeSharing(availableMobilityOptions)) {
      onlyBikeSharingHelper(origin, destination, departureTime).then(function(result) {
        if(!result) reject("No alternative bike-sharing found");
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.onlySharing(availableMobilityOptions)) {
      onlySharingHelper(origin, destination, departureTime).then(function(result) {
        if(!result) reject("No alternative sharing-routes found");
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.onlyCar(availableMobilityOptions)) {
      onlyCarHelper(incidents, origin, destination, departureTime).then(function(result) {
        if(!result) reject("No alternative car-routes found");
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.onlyBike(availableMobilityOptions)) {
      onlyBikeHelper(incidents, origin, destination, departureTime).then((result) => {
        if(!result) reject("No alternative bike-routes found");
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.onlyTrainTicket(availableMobilityOptions)) {
      onlyTrainTicketHelper(incidents, origin, destination, departureTime).then(function(result) {
        if(!result) reject("No alternative transit-route found");
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.carAndBike(availableMobilityOptions)) {
      carAndBikeHelper(incidents, origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.sharingAndBike(availableMobilityOptions)) {
      sharingAndBikeHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }

    if (checkMobilityOptionsHelper.bikeSharingAndBike(availableMobilityOptions)) {
      bikeSharingAndBikeHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.trainTicketAndBike(availableMobilityOptions)) {
      trainTicketAndBikeHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.sharingAndCar(availableMobilityOptions)) {
      sharingAndCarHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.trainTicketAndCar(availableMobilityOptions)) {
      trainTicketAndCarHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.bikeSharingAndTrainTicket(availableMobilityOptions)) {
      bikeSharingAndTrainTicketHelper(origin, destination, departureTime).then(function(result) {
        if(!result) reject("No bikeSharing-and-tansit-route found");
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.bikeAndTrainTicketAndCar(availableMobilityOptions)) {
      bikeAndTrainTicketAndCarHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.sharingAndTrainTicketAndCar(availableMobilityOptions)) {
      sharingAndTrainTicketAndCarHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.sharingAndBikeAndCar(availableMobilityOptions)) {
      sharingAndBikeAndCarHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.bikeSharingAndBikeAndTrainTicket(availableMobilityOptions)) {
      bikeSharingAndBikeAndTrainTicketHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.sharingAndTrainTicket(availableMobilityOptions)) {
      sharingAndTrainTicketHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.allOptions(availableMobilityOptions)) {
      allOptionsHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.noOptions(availableMobilityOptions)) {
      reject("error: The route could not be generated because the specified MobilityOptions do not match the cases.");
    }
  });
}

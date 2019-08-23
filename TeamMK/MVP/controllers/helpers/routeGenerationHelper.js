const checkMobilityOptionsHelper = require('./checkMobilityOptionsHelper');
const onlyBikeSharingHelper = require('./options/onlyBikeSharingHelper');
const onlySharingHelper = require('./options/onlySharingHelper');
const onlyCarHelper = require('./options/onlyCarHelper');
const onlyBikeHelper = require('./options/onlyBikeHelper');
const onlyTrainTicketHelper = require('./options/onlyTrainTicketHelper');
const carAndBikeHelper = require('./options/carAndBikeHelper');
const sharingAndBikeHelper = require('./options/sharingAndBikeHelper');
const bikeSharingAndBikeHelper = require('./options/bikeSharingAndBikeHelper');
const trainTicketAndBikeHelper = require('./options/trainTicketAndBikeHelper');
const sharingAndCarHelper = require('./options/sharingAndCarHelper');
const trainTicketAndCarHelper = require('./options/trainTicketAndCarHelper');
const bikeSharingAndTrainTicketHelper = require('./options/bikeSharingAndTrainTicketHelper');
const bikeAndTrainTicketAndCarHelper = require('./options/bikeAndTrainTicketAndCarHelper');
const ssharingAndTrainTicketAndCarHelper = require('./options/sharingAndTrainTicketAndCarHelper');
const sharingAndBikeAndCarHelper = require('./options/sharingAndBikeAndCarHelper');
const bikeSharingAndBikeAndTrainTicketHelper = require('./options/bikeSharingAndBikeAndTrainTicketHelper');
const allOptionsHelper = require('./options/allOptionsHelper');

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
    if (checkMobilityOptionsHelper.onlyCar(availableMobilityOptions)) {
      onlyCarHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.onlyBike(availableMobilityOptions)) {
      onlyBikeHelper(origin, destination, departureTime).then((result) => {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.onlyTrainTicket(availableMobilityOptions)) {
      onlyTrainTicketHelper(origin, destination, departureTime).then(function(result) {
        resolve(result);
      }, (error) => {
        reject(error);
      });
    }
    if (checkMobilityOptionsHelper.carAndBike(availableMobilityOptions)) {
      carAndBikeHelper(origin, destination, departureTime).then(function(result) {
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
      ssharingAndTrainTicketAndCarHelper(origin, destination, departureTime).then(function(result) {
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

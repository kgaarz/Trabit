const checkMobilityOptionsHelper = require('./checkMobilityOptionsHelper');
const onlyBikeSharingHelper = require('./onlyBikeSharingHelper');
const onlySharingHelper = require('./onlySharingHelper');
const onlyCarHelper = require('./onlyCarHelper');
const onlyBikeHelper = require('./onlyBikeHelper');
const onlyTrainTicketHelper = require('./onlyTrainTicketHelper');
const carAndBikeHelper = require('./carAndBikeHelper');
const sharingAndBikeHelper = require('./sharingAndBikeHelper');

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
          onlyBikeHelper(origin, destination, departureTime).then(function(result) {
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
        if(checkMobilityOptionsHelper.noOptions(availableMobilityOptions)){
          reject("error: The route could not be generated because the specified MobilityOptions do not match the cases.");
        }
      });
    }
  
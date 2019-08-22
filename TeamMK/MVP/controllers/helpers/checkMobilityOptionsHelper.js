module.exports = {
  onlyBikeSharing: function(availableMobilityOptions){
    return !availableMobilityOptions.car && !availableMobilityOptions.driverLicence &&
    !availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  },
  onlySharing: function(availableMobilityOptions){
    return !availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    !availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  },
  onlyCar: function(availableMobilityOptions){
    return availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    !availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    !availableMobilityOptions.sharing;
  },
  onlyBike: function(availableMobilityOptions){
    return !availableMobilityOptions.car && !availableMobilityOptions.driverLicence &&
    availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    !availableMobilityOptions.sharing;
  },
  onlyTrainTicket: function(availableMobilityOptions){
    return !availableMobilityOptions.car && !availableMobilityOptions.driverLicence &&
    !availableMobilityOptions.bike && availableMobilityOptions.trainTicket &&
    !availableMobilityOptions.sharing;
  },
  carAndBike: function(availableMobilityOptions){
    return availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    !availableMobilityOptions.sharing;
  },
  sharingAndBike: function(availableMobilityOptions){
    return !availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  },
  bikeSharingAndBike: function(availableMobilityOptions){
    return !availableMobilityOptions.car && !availableMobilityOptions.driverLicence &&
    availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  },
  trainTicketAndBike: function(availableMobilityOptions){
    return !availableMobilityOptions.car && !availableMobilityOptions.driverLicence &&
    availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    !availableMobilityOptions.sharing;
  },
  sharingAndCar: function(availableMobilityOptions){
    return availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    !availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  },
  trainTicketAndCar: function(availableMobilityOptions){
    return availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    !availableMobilityOptions.bike && availableMobilityOptions.trainTicket &&
    !availableMobilityOptions.sharing;
  },
  bikeSharingAndTrainTicket: function(availableMobilityOptions){
    return !availableMobilityOptions.car && !availableMobilityOptions.driverLicence &&
    !availableMobilityOptions.bike && availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  },
  bikeAndTrainTicketAndCar: function(availableMobilityOptions){
    return availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    availableMobilityOptions.bike && availableMobilityOptions.trainTicket &&
    !availableMobilityOptions.sharing;
  },
  sharingAndTrainTicketAndCar: function(availableMobilityOptions){
    return availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    !availableMobilityOptions.bike && availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  },
  sharingAndBikeAndCar: function(availableMobilityOptions){
    return availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    availableMobilityOptions.bike && !availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  },
  bikeSharingAndBikeAndTrainTicket: function(availableMobilityOptions){
    return !availableMobilityOptions.car && !availableMobilityOptions.driverLicence &&
    availableMobilityOptions.bike && availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  },
  allOptions: function(availableMobilityOptions){
    return availableMobilityOptions.car && availableMobilityOptions.driverLicence &&
    availableMobilityOptions.bike && availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  }
}

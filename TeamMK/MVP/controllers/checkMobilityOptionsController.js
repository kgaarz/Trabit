module.exports = {
  onlyBikeSharing: function(availableMobilityOptions){
    return !availableMobilityOptions.car && !availableMobilityOptions.eCar && !availableMobilityOptions.driverLicence &&
    !availableMobilityOptions.bike && !availableMobilityOptions.longboard && !availableMobilityOptions.motorScooter &&
    !availableMobilityOptions.eMotorScooter && !availableMobilityOptions.eScooter && !availableMobilityOptions.trainTicket &&
    availableMobilityOptions.sharing;
  }
}

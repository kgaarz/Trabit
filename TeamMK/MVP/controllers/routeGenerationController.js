const checkMobilityOptionsController = require('./checkMobilityOptionsController');

module.exports = {
  generateRoute: function(availableMobilityOptions){
    if(checkMobilityOptionsController.onlyBikeSharing(availableMobilityOptions)){
        
    }
    if(checkMobilityOptionsController.onlySharing(availableMobilityOptions)){

    }
  }
}

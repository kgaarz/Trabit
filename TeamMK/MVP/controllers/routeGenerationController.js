const checkMobilityOptionsController = require('./checkMobilityOptionsController');
const dataController = require('./dataController');


module.exports = {
  generateRoute: function (availableMobilityOptions, origin, destination, departureTime) {
    if (checkMobilityOptionsController.onlyBikeSharing(availableMobilityOptions)) {
      var cabData = [];
      console.log(origin);
      var smallRadius = dataController.getCabData(origin.lat, origin.lng, 200);
      var mediumRadius = dataController.getCabData(origin.lat, origin.lng, 400);
      var bigRadius = dataController.getCabData(origin.lat, origin.lng, 1000);

      Promise.all([smallRadius,mediumRadius,bigRadius]).then((values)=>{
        if(values[0].length==0){
          if(values[1].length==0){
            if(values[2].length==0){
              console.log("Keine Fahrräder gefunden");
            }else 
            {cabData = values[2];}
          }else
          {cabData = values[1];}
        }else
        {cabData = values[0];}
        
        cabData.forEach(i => {
          dataController.getGoogleDirectionsAPIData(origin, cabData[i].geoLocation, departureTime, "walking");
          dataController.getGoogleDirectionsAPIData(cabData[i].geoLocation, destination, departureTime, "bicycle"); 
        });

        console.log(cabData);
        });
    }
    if (checkMobilityOptionsController.onlySharing(availableMobilityOptions)) {


    }

  }
}






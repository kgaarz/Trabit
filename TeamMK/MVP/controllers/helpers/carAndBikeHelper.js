module.exports = function(origin, destination, departureTime) {
    return new Promise(function(resolve, reject) {
        var carWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, destination, departureTime, "driving");
        var bikeWay = apiRequestHelper.getGoogleDirectionsAPIData(origin, destination, departureTime, "bicycling");

        Promise.all([carWay, bikeWay]).then((values) => {
            var shortestRoute;
            if(values[0].duration<values[1].duration){
                shortestRoute = values[0];
                mode = "driving";
            }else{
                shortestRoute = values[1];
                mode = "bicycling";
            }

            const selectionOption = {
                modes: mode,
                duration: shortestRoute.duration,
                distance: shortestRoute.distance,
                switches: 0,
                sustainability: 0,
                route: shortestRoute
              }
              resolve(selectionOption);
      
          },
          (error)=>{
            reject(error);
          });
        },
        (error)=>{
          reject(error);
        });

}

bikeSharingAndTrainTicketHelper = require('./bikeSharingAndTrainTicketHelper');
sharingAndCarHelper = require('./sharingAndCarHelper');
trainTicketAndCarHelper = require('./trainTicketAndCarHelper');
apiRequestHelper = require('../apiRequestHelper');

module.exports = function(origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    var bikeSharingAndTrainTicketWay = bikeSharingAndTrainTicketHelper(origin, destination, departureTime);
    var sharingAndCarWay = sharingAndCarHelper(origin, destination, departureTime);
    var trainTicketAndCarWay = trainTicketAndCarHelper(origin, destination, departureTime);
  });
}

function generateSharingAndTrainTicketAndCarRoute(origin, destination, departureTime){
  apiRequestHelper.getGoogleDirectionsAPIData(origin, destination, departureTime, "transit").then((result) => {
    var value = result.steps[0].duration;
    var index = 0;

    for(i = 0; i < result.steps.length; i++){
      if(value < result.steps[i].duration){
        value = result.steps[i].duration;
        index = i;
      }
    }

    return checkStepsWithCar(origin, departureTime, result, index)
  });
}

function checkStepsWithCar(origin, departureTime, result, index) {
  return new Promise(function(resolve, reject) {
    var routes = [];
    for(j = 0; j < index; j++){
      routes.push(apiRequestHelper.getGoogleDirectionsAPIData(origin, result.steps[j].startLocation, departureTime, "driving"));
    }
    Promise.all(routes).then((values) => {
      
    });
  });
}

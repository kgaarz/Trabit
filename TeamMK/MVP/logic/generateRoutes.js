const axios = require('axios');

module.exports = {
  generateFastestRoute: function generateFastestRoute(availableMobilityOptions, origin, destination, depatureTime) {
    return new Promise(function(resolve, reject) {

      const mode = "driving";
      axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.lat + "," + origin.lng + '&destination=' + destination.lat + "," + destination.lng + '&mode=' + mode + '&departure_time=' + depatureTime + '&key=' + process.env.DIRECTIONS_KEY)
        .then(response => {
          jsonData = response.data.routes[0].legs[0];
          var comprimisedSteps = comprimiseSteps(jsonData.steps);

          const newRoute = {
            distance: jsonData.distance.value,
            duration: jsonData.duration.value,
            start_location: {
              lat: jsonData.start_location.lat,
              lng: jsonData.start_location.lng
            },
            end_location: {
              lat: jsonData.end_location.lat,
              lng: jsonData.end_location.lng
            },
            steps: comprimisedSteps
          };
          const selectionOption = {
            modes: [mode],
            duration: jsonData.duration.value,
            distance: jsonData.distance.value,
            switches: 0,
            sustainability: 100000000000,
            route: newRoute
          }
          resolve(selectionOption);
        }).catch(error => {
          reject(error);
        });
    });
  },

  generateSustainableRoute: function generateSustainableRoute(availableMobilityOptions, origin, destination, depatureTime) {
    return new Promise(function(resolve, reject) {

      const mode = "bicycling";
      axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.lat + "," + origin.lng + '&destination=' + destination.lat + "," + destination.lng + '&mode=' + mode + '&departure_time=' + depatureTime + '&key=' + process.env.DIRECTIONS_KEY)
        .then(response => {
          jsonData = response.data.routes[0].legs[0];
          var comprimisedSteps = comprimiseSteps(jsonData.steps);

          const newRoute = {
            distance: jsonData.distance.value,
            duration: jsonData.duration.value,
            start_location: {
              lat: jsonData.start_location.lat,
              lng: jsonData.start_location.lng
            },
            end_location: {
              lat: jsonData.end_location.lat,
              lng: jsonData.end_location.lng
            },
            steps: comprimisedSteps
          };
          const selectionOption = {
            modes: [mode],
            duration: jsonData.duration.value,
            distance: jsonData.distance.value,
            switches: 0,
            sustainability: 0,
            route: newRoute
          }
          resolve(selectionOption);
        }).catch(error => {
          reject(error);
        });
    });
  },

  generateMobilityChainRoute: function generateMobilityChainRoute(availableMobilityOptions, origin, destination, depatureTime) {
    return new Promise(function(resolve, reject) {

      const mode = "transit";
      axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.lat + "," + origin.lng + '&destination=' + destination.lat + "," + destination.lng + '&mode=' + mode + '&departure_time=' + depatureTime + '&key=' + process.env.DIRECTIONS_KEY)
        .then(response => {
          jsonData = response.data.routes[0].legs[0];
          var comprimisedSteps = comprimiseSteps(jsonData.steps);

          const newRoute = {
            distance: jsonData.distance.value,
            duration: jsonData.duration.value,
            start_location: {
              lat: jsonData.start_location.lat,
              lng: jsonData.start_location.lng
            },
            end_location: {
              lat: jsonData.end_location.lat,
              lng: jsonData.end_location.lng
            },
            steps: comprimisedSteps
          };
          const selectionOption = {
            modes: [mode],
            duration: jsonData.duration.value,
            distance: jsonData.distance.value,
            switches: newRoute.steps.length,
            sustainability: 100,
            route: newRoute
          }
          resolve(selectionOption);
        }).catch(error => {
          reject(error);
        });
    });
  }
}

function comprimiseSteps(data) {
  var steps = [];
  for (var i = 0; i < data.length; i++) {
    var object = {
      start_location: data[i].start_location,
      end_location: data[i].end_location
    };
    steps[i] = object;
  }
  return steps;
}

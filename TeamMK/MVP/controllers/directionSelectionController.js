const axios = require('axios');
const DirectionsSelections = require('../models/DirectionsSelections');
const User = require('../models/User');
const mobilitiesController = require('./mobilitiesController');
const Mobilities = require('../models/Mobilities');
const routeGenerationHelper = require('./helpers/routeGenerationHelper');

module.exports = {
  postNewDirectionSelection: function(userID, mobilitiesID, req, res) {
    User.findById(
        userID
      )
      .exec()
      .then(doc => {
        if (doc) {
          Mobilities.findById(
              mobilitiesID
            )
            .exec()
            .then(data => {
              if (data) {
                //check if all required query parameters are available
                !req.body.origin && res.status(400).send({
                  message: 'origin is required!'
                });
                !req.body.destination && res.status(400).send({
                  message: 'destination is required!'
                });
                !req.body.depatureTime && res.status(400).send({
                  message: 'depatureTime is required!'
                });

                var fastestRoute = generateFastestRoute(doc.availableMobilityOptions, data, req.body.origin, req.body.destination, req.body.depatureTime);
                var sustainableRoute = generateSustainableRoute(doc.availableMobilityOptions, req.body.origin, req.body.destination, req.body.depatureTime);
                var mobilityChainRoute = generateMobilityChainRoute(doc.availableMobilityOptions, req.body.origin, req.body.destination, req.body.depatureTime);

                Promise.all([fastestRoute, sustainableRoute, mobilityChainRoute]).then(values => {
                  const directionsSelections = new DirectionsSelections({
                    selections: values
                  });

                  res.status(200).send(directionsSelections);
                  // directionsSelections.save(function(error, result) {
                  //   if (result) {
                  //     res.status(200).send(result.id);
                  //   }
                  //   if (error) {
                  //     res.status(502).json({
                  //       message: "Database-Connection failed",
                  //       error: error
                  //     });
                  //   }
                  // });
                }).catch(error => {
                  res.status(404).send(error);
                });
              } else {
                res
                  .status(404)
                  .json({
                    message: "No valid entry found for provided ID"
                  });
              }
            })
            .catch(err => {
              res.status(502).json({
                message: "Database-Connection failed",
                error: err
              });
            });
        } else {
          res
            .status(404)
            .json({
              message: "No valid entry found for provided ID"
            });
        }
      })
      .catch(err => {
        res.status(502).json({
          message: "Database-Connection failed",
          error: err
        });
      });
  }
}


function generateFastestRoute(availableMobilityOptions, nearMobilities, origin, destination, departureTime) {
  return new Promise((resolve, reject) => {
    routeGenerationHelper(availableMobilityOptions, origin, destination, departureTime).then((result) => {
      resolve(result);
    },(error) => {
      reject(error);
    });
  });
}

function generateSustainableRoute(availableMobilityOptions, origin, destination, depatureTime) {
  return new Promise(function(resolve, reject) {

    const mode = "bicycling";
    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.lat + "," + origin.lng + '&destination=' + destination.lat + "," + destination.lng + '&mode=' + mode + '&departure_time=' + depatureTime + '&key=' + process.env.DIRECTIONS_KEY)
      .then(response => {
        jsonData = response.data.routes[0].legs[0];
        var comprimisedSteps = comprimiseSteps(jsonData.steps);

        const newRoute = {
          distance: jsonData.distance.value,
          duration: jsonData.duration.value,
          startLocation: {
            lat: jsonData.start_location.lat,
            lng: jsonData.start_location.lng
          },
          endLocation: {
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
}

function generateMobilityChainRoute(availableMobilityOptions, origin, destination, depatureTime) {
  return new Promise(function(resolve, reject) {

    const mode = "transit";
    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.lat + "," + origin.lng + '&destination=' + destination.lat + "," + destination.lng + '&mode=' + mode + '&departure_time=' + depatureTime + '&key=' + process.env.DIRECTIONS_KEY)
      .then(response => {
        jsonData = response.data.routes[0].legs[0];
        var comprimisedSteps = comprimiseSteps(jsonData.steps);

        const newRoute = {
          distance: jsonData.distance.value,
          duration: jsonData.duration.value,
          startLocation: {
            lat: jsonData.start_location.lat,
            lng: jsonData.start_location.lng
          },
          endLocation: {
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

function getGoogleDirectionsAPIData(origin, destination, departureTime, mode) {
  return new Promise((resolve, reject) => {
    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.lat + "," + origin.lng + '&destination=' + destination.lat + "," + destination.lng + '&mode=' + mode + '&departure_time=' + departureTime + '&key=' + process.env.DIRECTIONS_KEY)
      .then(response => {
        jsonData = response.data.routes[0].legs[0];
        var comprimisedSteps = comprimiseSteps(jsonData.steps);

        const newRoute = {
          distance: jsonData.distance.value,
          duration: jsonData.duration.value,
          startLocation: {
            lat: jsonData.start_location.lat,
            lng: jsonData.start_location.lng
          },
          endLocation: {
            lat: jsonData.end_location.lat,
            lng: jsonData.end_location.lng
          },
          steps: comprimisedSteps
        }
        resolve(newRoute);
      }).catch(error => {
        reject(error);
      });
  });
}

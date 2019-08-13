const express = require('express');
const axios = require('axios');
const router = express.Router();
const DirectionsSelection = require('../models/DirectionsSelections');
const User = require('../models/User');
require('dotenv/config');

router.get('/:directionSelectionID', (req, res) => {
  const directionSelectionID = req.params.directionSelectionID
  DirectionsSelection.findById(
      directionSelectionID
    )
    .exec()
    .then(doc => {
      if (doc) {

        res.status(200).send(doc);
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
});

router.post('/:userID', (req, res) => {
  const userID = req.params.userID
  User.findById(
      userID
    )
    .exec()
    .then(doc => {
      if (doc) {
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


        var fastestRoute = generateFastestRoute(doc.availableMobilityOptions, req.body.origin, req.body.destination, req.body.depatureTime);
        var sustainableRoute = generateSustainableRoute(doc.availableMobilityOptions, req.body.origin, req.body.destination, req.body.depatureTime);
        var mobilityChainRoute = generateMobilityChainRoute(doc.availableMobilityOptions, req.body.origin, req.body.destination, req.body.depatureTime);

        Promise.all([fastestRoute,sustainableRoute, mobilityChainRoute]).then(values =>{
          var routeSelection = [];
          for(i=0; i<values.length; i++){
            
          }


        });


        //res.status(200).send(doc);
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
});

router.delete('/:directionSelectionID', (req, res) => {

});

function generateFastestRoute(availableMobilityOptions, origin, destination, depatureTime) {
  return new Promise(function(resolve, reject) {

      const mode = "driving";
      axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.lat + "," + origin.lng + '&destination=' + destination.lat + "," + destination.lng + '&mode=' + mode + '&departure_time=' + depatureTime + '&key=' + process.env.DIRECTIONS_KEY)
        .then(response => {
          jsonData = response.data.routes[0].legs[0];
          var comprimisedSteps = comprimiseSteps(jsonData.steps);

          const newRoute = {
            distance: jsonData.distance.value,
            duration: jsonData.duration.value,
            start_location: [jsonData.start_location.lng, jsonData.start_location.lat],
            end_location: [jsonData.end_location.lng, jsonData.end_location.lat],
            steps: comprimisedSteps
          };
          resolve(newRoute);
        }).catch(error => {
          reject(error);
        });
    });
  }

  function generateSustainableRoute(availableMobilityOptions, origin, destination, depatureTime){
  return new Promise(function(resolve, reject) {

    const mode = "bicycling";
    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.lat + "," + origin.lng + '&destination=' + destination.lat + "," + destination.lng + '&mode=' + mode + '&departure_time=' + depatureTime + '&key=' + process.env.DIRECTIONS_KEY)
      .then(response => {
        jsonData = response.data.routes[0].legs[0];
        var comprimisedSteps = comprimiseSteps(jsonData.steps);

        const newRoute = {
          distance: jsonData.distance.value,
          duration: jsonData.duration.value,
          start_location: [jsonData.start_location.lng, jsonData.start_location.lat],
          end_location: [jsonData.end_location.lng, jsonData.end_location.lat],
          steps: comprimisedSteps
        };
        resolve(newRoute);
      }).catch(error => {
        reject(error);
      });
  });
}

  function generateMobilityChainRoute(availableMobilityOptions, origin, destination, depatureTime){
  return new Promise(function(resolve, reject) {

    const mode = "transit";
    axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + origin.lat + "," + origin.lng + '&destination=' + destination.lat + "," + destination.lng + '&mode=' + mode + '&departure_time=' + depatureTime + '&key=' + process.env.DIRECTIONS_KEY)
      .then(response => {
        jsonData = response.data.routes[0].legs[0];
        var comprimisedSteps = comprimiseSteps(jsonData.steps);

        const newRoute = {
          distance: jsonData.distance.value,
          duration: jsonData.duration.value,
          start_location: [jsonData.start_location.lng, jsonData.start_location.lat],
          end_location: [jsonData.end_location.lng, jsonData.end_location.lat],
          steps: comprimisedSteps
        };
        resolve(newRoute);
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

  module.exports = router;

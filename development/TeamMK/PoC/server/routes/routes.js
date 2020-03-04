const express = require('express');
const router = express.Router();
const Routes = require('../models/Routes');
const User = require('../models/User');
const axios = require('axios');
require('dotenv/config');

router.get('/', async (req, res) => {
  try {
    const routes = await Routes.find();
    res.json(routes);
  } catch (error) {
    res.json({
      message: error
    });
  }
});

router.post('/', async (req, res) => {

  //check if all required query parameters are available
  !req.query.origin && res.status(400).send({
    message: 'origin is required!'
  });
  !req.query.destination && res.status(400).send({
    message: 'destination is required!'
  });
  !req.query.user_id && res.status(400).send({
    message: 'user_id is required!'
  });

  var validUser = checkValidUserID(req.query.user_id);

  validUser.then(function(result) {
    console.log("Valid User")
  }, function(error) {
    res.status(400).send({
      message: 'user_id is not valid!'
    })
  });

  var jsonData;
  var mode = req.query.mode ? req.query.mode : 'driving';
  var depature_time = checkDepartureTime(req.query.departure_time, res);

  axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + req.query.origin + '&destination=' + req.query.destination + '&mode=' + mode + '&departure_time=' + depature_time + '&key=' + process.env.DIRECTIONS_KEY)
    .then(response => {
      jsonData = response.data.routes[0].legs[0];
      var comprimisedSteps = comprimiseSteps(jsonData.steps);

      const newRoute = new Routes({
        user_id: req.query.user_id,
        distance: jsonData.distance.value,
        duration: jsonData.duration.value,
        start_location: [jsonData.start_location.lng, jsonData.start_location.lat],
        end_location: [jsonData.end_location.lng, jsonData.end_location.lat],
        steps: comprimisedSteps
      });

      newRoute.save(function(error, result) {
        if (result) {
          res.status(200).send(result);
        }
        if (error) {
          res.status(400).send(error);
        }
      });

    }).catch(error => {
      res.status(400).send(error);
    });
});

function checkDepartureTime(departure_time, res) {
  if (!departure_time) {
    var now = new Date().getTime();
  } else {
    var now = new Date(departure_time * 1000).valueOf() > new Date().getTime() ? departure_time : res.send("Ungültige Abfahrtszeit");
  }
  return now;
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

function checkValidUserID(data) {
  return new Promise(function(resolve, reject) {
    User.findOne({
      _id: data
    }).exec().then(doc => {
      if (doc) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  })
}

module.exports = router;

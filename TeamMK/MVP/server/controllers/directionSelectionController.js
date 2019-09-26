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
                !req.body.departureTime && res.status(400).send({
                  message: 'departureTime is required!'
                });

                var fastestRoute = generateFastestRoute(doc.availableMobilityOptions, data, req.body.origin, req.body.destination, req.body.departureTime);
                var sustainableRoute = generateSustainableRoute(doc.availableMobilityOptions, req.body.origin, req.body.destination, req.body.departureTime);


                Promise.all([fastestRoute, sustainableRoute]).then(values => {
                  const directionsSelections = new DirectionsSelections({
                    selections: values
                  });

                   directionsSelections.save(function(error, result) {
                     if (result) {
                       res.status(200).send(result.id);
                     }
                     if (error) {
                      res.status(502).json({
                         message: "Database-Connection failed",
                         error: error
                       });
                     }
                   });
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
    }, (error) => {
      reject(error);
    });
  });
}

function generateSustainableRoute(availableMobilityOptions, origin, destination, departureTime) {
  return new Promise(function(resolve, reject) {
    resolve()
  });
}

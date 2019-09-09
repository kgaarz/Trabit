const axios = require('axios');
const AlternativeDirections = require('../models/AlternativeDirections');
const User = require('../models/User');
const Traffics = require('../models/Traffics');
const routeGenerationTrafficHelper = require('./helpers/routeGenerationTrafficHelper');

module.exports = {
  postNewAlternativeDirection: function(userID, trafficID, req, res){
    User.findById(
        userID
      )
      .exec()
      .then(doc => {
        if (doc) {
          Traffics.findById(
              trafficID
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

                // TODO: departureTime mitsenden?
                generateFastestRoute(doc.availableMobilityOptions, data.traffic[0].incidents, req.body.origin, req.body.destination, req.body.departureTime)
                .then(value => {
                  const alternativeDirections = new AlternativeDirections({
                    modes: value.modes,
                    duration: value.duration,
                    distance: value.distance,
                    switches: value.switches,
                    sustainability: value.sustainability,
                    route: value.route
                  });

                  res.status(200).send(alternativeDirections);
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


function generateFastestRoute(availableMobilityOptions, incidents, origin, destination, departureTime) {
  return new Promise((resolve, reject) => {
    routeGenerationTrafficHelper(availableMobilityOptions, incidents, origin, destination, departureTime).then((result) => {

      resolve(result);
    }, (error) => {
      reject(error);
    });
  });
}

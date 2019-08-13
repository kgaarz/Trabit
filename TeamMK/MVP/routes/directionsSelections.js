const express = require('express');
const router = express.Router();
const DirectionsSelections = require('../models/DirectionsSelections');
const User = require('../models/User');
const generateRoutes = require('../logic/generateRoutes');
require('dotenv/config');

router.get('/:directionSelectionID', (req, res) => {
  const directionSelectionID = req.params.directionSelectionID
  DirectionsSelections.findById(
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


        var fastestRoute = generateRoutes.generateFastestRoute(doc.availableMobilityOptions, req.body.origin, req.body.destination, req.body.depatureTime);
        var sustainableRoute = generateRoutes.generateSustainableRoute(doc.availableMobilityOptions, req.body.origin, req.body.destination, req.body.depatureTime);
        var mobilityChainRoute = generateRoutes.generateMobilityChainRoute(doc.availableMobilityOptions, req.body.origin, req.body.destination, req.body.depatureTime);

        Promise.all([fastestRoute, sustainableRoute, mobilityChainRoute]).then(values => {
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
                error: err
              });
            }
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
});

router.delete('/:directionSelectionID', (req, res) => {
  const directionSelectionID = req.params.directionSelectionID
  DirectionsSelections.findOneAndDelete(
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

module.exports = router;

const express = require('express');
const router = express.Router();
const DirectionsSelections = require('../models/DirectionsSelections');
const User = require('../models/User');
const generateRoutes = require('../logic/generateRoutes');
const getRoute = require('../logic/getRoutes');
const deleteRoute = require('../logic/deleteRoutes');
require('dotenv/config');

router.get('/:directionSelectionID', (req, res) => {
  getRoute(req.params.directionSelectionID, DirectionsSelections, res);
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
                error: error
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
  deleteRoute(req.params.directionSelectionID, DirectionsSelections, res);
});

module.exports = router;

const express = require('express');
const axios = require('axios');
const router = express.Router();
const Directions = require('../models/Directions');
const DirectionsSelection = require('../models/DirectionsSelections');
require('dotenv/config');
const deleteRoute = require('../logic/deleteRoutes');

router.get('/:directionID', (req, res) => {
    const directionID=req.params.directionID
    Directions.findById(
        directionID
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

router.post('/:userID/:directionSelectionID', (req, res) => {
  const selection = req.body.selection;
  DirectionsSelection.findById(
    req.params.directionSelectionID
  )
  .exec()
  .then(doc=>{
    if (doc) {
      var selectedRoute = doc.selections[selection];
      const directions = new Directions({
        userID: req.params.userID,
        distance: selectedRoute.distance,
        duration: selectedRoute.duration,
        startLocation: {
          lat: selectedRoute.route.startLocation.lat,
          lng: selectedRoute.route.startLocation.lng
        },
        endLocation:{
          lat: selectedRoute.route.endLocation.lat,
          lng: selectedRoute.route.endLocation.lng
        },
		steps: selectedRoute.route.steps
      })
	  
	  directions.save(function(error, result) {
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
    }
  });
});

router.put('/:directionID/:alternativeDirectionID', (req, res) => {

});

router.delete('/:directionID', (req, res) => {
  deleteRoute(req.params.directionID, Directions, res);
});

module.exports = router;

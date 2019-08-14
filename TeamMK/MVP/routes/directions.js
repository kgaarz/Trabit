const express = require('express');
const axios = require('axios');
const router = express.Router();
const Directions = require('../models/Directions');
const DirectionsSelection = require('../models/DirectionsSelections');
require('dotenv/config');
const getRoute = require('../controllers/getRoutes');
const deleteRoute = require('../controllers/deleteRoutes');

router.get('/:directionID', (req, res) => {
  getRoute(req.params.directionID, Directions, res);
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

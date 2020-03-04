const express = require('express');
const axios = require('axios');
const router = express.Router();
const Directions = require('../models/Directions');
const directionsController = require('../controllers/directionsController');
const routesController = require('../controllers/routesController');
require('dotenv/config');


router.get('/:directionID', (req, res) => {
  routesController.getById(req.params.directionID, Directions, res);
});

router.post('/:userID/:directionSelectionID', (req, res) => {
  directionsController.postNewDirection(req.params.userID, req.params.directionSelectionID, req, res)
});

router.put('/:directionID/:alternativeDirectionID', (req, res) => {
  directionsController.updateDirections(req.params.directionID, req.params.alternativeDirectionID, req, res);
});

router.delete('/:directionID', (req, res) => {
  routesController.deleteById(req.params.directionID, Directions, res);
});

module.exports = router;

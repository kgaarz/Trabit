const express = require('express');
const axios = require('axios');
const router = express.Router();
const AlternativeDirections = require('../models/AlternativeDirections');
const routesController = require('../controllers/routesController');
const alternativeDirectionsController = require('../controllers/alternativeDirectionsController');
require('dotenv/config');


router.get('/:alternativeDirectionID', (req, res) => {
  routesController.getById(req.params.alternativeDirectionID, AlternativeDirections, res);
});

router.post('/:userID/:trafficID', (req, res) => {
  alternativeDirectionsController.postNewAlternativeDirection(req.params.userID, req.params.trafficID, req, res);
});

router.delete('/:alternativeDirectionID', (req, res) => {
  routesController.getById(req.params.alternativeDirectionID, AlternativeDirections, res);
});

module.exports = router;

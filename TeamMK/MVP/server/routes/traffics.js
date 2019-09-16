const express = require('express');
const axios = require('axios');
const router = express.Router();
const Traffics = require('../models/Traffics');
const trafficController = require('../controllers/trafficController');
const routesController = require('../controllers/routesController');
require('dotenv/config');

router.get('/:trafficID', (req, res) => {
  routesController.getById(req.params.trafficID, Traffics, res);
});

router.post('/:directionID', (req, res) => {
  trafficController.postNewTraffic(req.params.directionID, res);
});

router.put('/:directionID/:trafficID', (req, res) => {
  trafficController.updateTraffic(req.params.directionID, req.params.trafficID, res);
});

router.delete('/:trafficID', (req, res) => {
  routesController.deleteById(req.params.trafficID, Traffics, res);
});

module.exports = router;

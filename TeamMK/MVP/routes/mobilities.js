const express = require('express');
const axios = require('axios');
const router = express.Router();
const Mobilities = require('../models/Mobilities');
const routesController = require('../controllers/routesController');
const mobilitiesController = require('../controllers/mobilitiesController');
require('dotenv/config');

router.get('/:mobilitiesID', (req, res) => {
  routesController.getById(req.params.mobilitiesID, Mobilities, res);
});

router.post('/:userID', (req, res) => {
	mobilitiesController.postNewMobilities(Mobilities, req.params.userID, req, res);
});

router.put('/:userID/:mobilitiesID', (req, res) => {
  mobilitiesController.updateMobilities(req.params.userID, req.params.mobilitiesID, req, res);
});

module.exports = router;

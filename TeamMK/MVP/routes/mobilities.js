const express = require('express');
const axios = require('axios');
const router = express.Router();
const Mobilities = require('../models/Mobilities');
require('dotenv/config');
const getRoute = require('../controllers/getRoutes');
const searchMobilities = require('../controllers/mobilitiesController');

router.get('/:mobilitiesID', (req, res) => {
  getRoute(req.params.mobilitiesID, Mobilities, res);
});

router.post('/:userID', (req, res) => {
	searchMobilities(Mobilities, req.params.userID, req, res);
});

router.put('/:userID/:mobilitiesID', (req, res) => {
  
});

router.delete('/:mobilitiesID', (req, res) => {
  deleteRoute(req.params.mobilitiesID, Mobilities, res);
});

module.exports = router;

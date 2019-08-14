const express = require('express');
const axios = require('axios');
const router = express.Router();
const Mobilities = require('../models/Mobilities');
require('dotenv/config');
const getRoute = require('../controllers/getRoutes');

router.get('/:mobilitiesID', (req, res) => {
  getRoute(req.params.mobilitiesID, Mobilities, res);
});

router.post('/:userID', (req, res) => {

});

router.put('/:userID/:mobilitiesID', (req, res) => {
  deleteRoute(req.params.mobilitiesID, Mobilities, res);
});

module.exports = router;

const express = require('express');
const axios = require('axios');
const router = express.Router();
const AlternativeDirections = require('../models/AlternativeDirections');
require('dotenv/config');
const getRoute = require('../logic/getRoutes');
const deleteRoute = require('../logic/deleteRoutes');

router.get('/:alternativeDirectionID', (req, res) => {
  getRoute(req.params.alternativeDirectionID, AlternativeDirections, res);
});

router.post('/:userID/:trafficID', (req, res) => {

});

router.delete('/:alternativeDirectionID', (req, res) => {
  deleteRoute(req.params.alternativeDirectionID, AlternativeDirections, res);
});

module.exports = router;

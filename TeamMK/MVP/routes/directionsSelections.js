const express = require('express');
const router = express.Router();
const DirectionsSelections = require('../models/DirectionsSelections');
const directionSelectionController = require('../controllers/directionSelectionController');
const routesController = require('../controllers/routesController');
require('dotenv/config');

router.get('/:directionSelectionID', (req, res) => {
  routesController.getById(req.params.directionSelectionID, DirectionsSelections, res);
});

router.post('/:userID', (req, res) => {
  directionSelectionController.postNewDirectionSelection(req.params.userID, req, res);
});

router.delete('/:directionSelectionID', (req, res) => {
  routesController.deleteById(req.params.directionSelectionID, DirectionsSelections, res);
});

module.exports = router;

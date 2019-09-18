const express = require('express');
const router = express.Router();
const ApiError = require('../exceptions/apiExceptions');
const RouteAlertController = require('../controllers/routeAlertController');

// create route alert
router.post('/routeAlerts', async (req, res) => {
    try {
        if (!req.body) {
            throw new ApiError('Request body is missing!', 400);
        }
        res.status(201).send(await RouteAlertController.create(req.body));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// delete route alert
router.delete('/routeAlerts/:routeAlertId', async (req, res) => {
    try {
        res.status(204).send(await RouteAlertController.delete(req.params.routeAlertId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

module.exports = router;
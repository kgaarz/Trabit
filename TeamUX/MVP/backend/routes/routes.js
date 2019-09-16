const express = require('express');
const router = express.Router();
const ApiError = require('../exceptions/apiExceptions');
const RouteController = require('../controllers/routeController');

// create route
router.post('/routes', async (req, res) => {
    try {
        if (!req.body) {
            throw new ApiError('Request body is missing!', 400);
        }
        res.status(201).send(await RouteController.create(req.body));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// delete route
router.delete('/routes/:routeId', async (req, res) => {
    try {
        res.status(204).send(await RouteController.delete(req.params.routeId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

module.exports = router;
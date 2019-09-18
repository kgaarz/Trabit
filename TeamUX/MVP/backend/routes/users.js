const express = require('express');
const router = express.Router();
const ApiError = require('../exceptions/apiExceptions');
const UserController = require('../controllers/userController');

// create user
router.post('/users', async (req, res) => {
    try {
        if (!req.body) {
            throw new ApiError('Request body is missing!', 400);
        }
        res.status(201).send(await UserController.create(req.body));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// get specific user
router.get('/users/:userId', async (req, res) => {
    try {
        res.status(200).send(await UserController.getSpecific(req.params.userId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// delete user
router.delete('/users/:userId', async (req, res) => {
    try {
        res.status(204).send(await UserController.delete(req.params.userId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// update profile
router.put('/users/:userId/profile', async (req, res) => {
    try {
        if (!req.body) {
            throw new ApiError('Request body is missing!', 400);
        }
        res.status(204).send(await UserController.updateProfile(req.params.userId, req.body));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// update mobility
router.put('/users/:userId/mobility', async (req, res) => {
    try {
        if (!req.body) {
            throw new ApiError('Request body is missing!', 400);
        }
        res.status(204).send(await UserController.updateMobility(req.params.userId, req.body));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// get route alerts
router.get('/users/:userId/routeAlerts', async (req, res) => {
    try {
        res.status(200).send(await UserController.getRouteAlerts(req.params.userId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

module.exports = router;
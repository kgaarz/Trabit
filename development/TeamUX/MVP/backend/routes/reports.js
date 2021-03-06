const express = require('express');
const router = express.Router();
const ApiError = require('../exceptions/apiExceptions');
const ReportController = require('../controllers/reportController');

// create report
router.post('/reports', async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            throw new ApiError('Request body is missing!', 400);
        }
        res.status(201).send(await ReportController.create(req.body));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// get filtered reports
router.get('/reports', async (req, res) => {
    try {
        // check for required query parameter combinations
        const params = req.query;
        if ((params.originLat && !params.originLng) || (params.originLng && !params.originLat)) {
            throw new ApiError(`Missing URL parameter: ${params.originLat === undefined ? 'lat' : 'lng'} (origin)`, 400);
        }
        if ((params.destinationLat && !params.destinationLng) || (params.destinationLng && !params.destinationLat)) {
            throw new ApiError(`Missing URL parameter: ${params.destinationLat === undefined ? 'lat' : 'lng'} (destination)`, 400);
        }
        if (params.transportTag && !params.transportType) {
            throw new ApiError('Missing URL parameter: transportType', 400);
        }
        res.status(200).send(await ReportController.getFiltered(params));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// get specific report
router.get('/reports/:reportId', async (req, res) => {
    try {
        res.status(200).send(await ReportController.getSpecific(req.params.reportId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// delete report
router.delete('/reports/:reportId', async (req, res) => {
    try {
        res.status(204).send(await ReportController.delete(req.params.reportId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// get upvotes
router.get('/reports/:reportId/upvotes', async (req, res) => {
    try {
        res.status(200).send(await ReportController.getVotes('upvotes', req.params.reportId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// get downvotes
router.get('/reports/:reportId/downvotes', async (req, res) => {
    try {
        res.status(200).send(await ReportController.getVotes('downvotes', req.params.reportId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// add upvote
router.put('/reports/:reportId/upvotes', async (req, res) => {
    try {
        const userId = req.header('userId');
        const statusCode = await ReportController.addVote('upvotes', req.params.reportId, userId);
        res.status(statusCode).send();
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// add downvote
router.put('/reports/:reportId/downvotes', async (req, res) => {
    try {
        const userId = req.header('userId');
        const statusCode = await ReportController.addVote('downvotes', req.params.reportId, userId);
        res.status(statusCode).send();
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// remove upvote
router.delete('/reports/:reportId/upvotes', async (req, res) => {
    try {
        const userId = req.header('userId');
        const statusCode = await ReportController.removeVote('upvotes', req.params.reportId, userId);
        res.status(statusCode).send();
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// remove downvote
router.delete('/reports/:reportId/downvotes', async (req, res) => {
    try {
        const userId = req.header('userId');
        const statusCode = await ReportController.removeVote('downvotes', req.params.reportId, userId);
        res.status(statusCode).send();
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// create comment
router.post('/reports/:reportId/comments', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send('Request body is missing!');
        }
        res.status(201).send(await ReportController.createComment(req.params.reportId, req.body));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

module.exports = router;
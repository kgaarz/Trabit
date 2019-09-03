const express = require('express')
const router = express.Router()
const ApiError = require('../exceptions/apiExceptions')
const ReportController = require('../controllers/reportController')

// create report
router.post('/reports', async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            throw new ApiError('Request body is missing!', 400)
        }
        res.status(201).send(await ReportController.create(req.body))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

// get filtered reports
router.get('/reports', async (req, res) => {
    try {
        // check for required query parameter combinations
        const params = req.query
        if ((params.lat && !params.long) || (params.long && !params.lat)) {
            throw new ApiError(`Missing URL parameter: ${params.lat === undefined ? 'lat' : 'long'}`, 400)
        }
        if (params.transportTag && !params.transportType) {
            throw new ApiError('Missing URL parameter: transportType', 400)
        }
        if (params.transportDirection && ((params.transportType && !params.transportTag) || (!params.transportType && params.transportTag))) {
            throw new ApiError(`Missing URL parameter: ${params.transportType === undefined ? 'transportType' : 'transportTag'}`, 400)
        }
        if (params.transportDirection && !params.transportType && !params.transportTag) {
            throw new ApiError('Missing URL parameters: transportType, transportTag', 400)
        }
        res.status(200).send(await ReportController.getFiltered(params))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

// get specific report
router.get('/reports/:reportId', async (req, res) => {
    try {
        res.status(200).send(await ReportController.getSpecific(req.params.reportId))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

// delete report
router.delete('/reports/:reportId', async (req, res) => {
    try {
        res.status(204).send(await ReportController.delete(req.params.reportId))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

// increment upvotes
router.patch('/reports/:reportId/upvotes', async (req, res) => {
    try {
        res.status(204).send(await ReportController.upvote(req.params.reportId))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

// increment downvotes
router.patch('/reports/:reportId/downvotes', async (req, res) => {
    try {
        res.status(204).send(await ReportController.downvote(req.params.reportId))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

// create comment
router.post('/reports/:reportId/comments', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).send('Request body is missing!')
        }
        res.status(201).send(await ReportController.createComment(req.params.reportId, req.body))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

module.exports = router
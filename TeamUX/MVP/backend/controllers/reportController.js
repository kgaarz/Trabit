const Report = require('../models/reportSchema')
const ApiError = require('../exceptions/apiExceptions')

class ReportController {
    constructor() {
        // report model with allowed insert params
        this.createReportModel = {
            author: undefined,
            description: undefined,
            location: {
                lat: undefined,
                long: undefined
            },
            transport: {
                transportType: undefined,
                transportTag: undefined,
                transportDirection: undefined,
            }
        }
        this.createCommentModel = {
            author: undefined,
            content: undefined
        }
    }

    async create(body) {
        // making sure the report only consists of the allowed insert params
        const newReport = {}
        Object.keys(this.createReportModel).forEach(key => newReport[key] = body[key])
        // check if similar report already exists
        const report = await Report.find({
            // // TODO: think about a solution for locaiton radius of car incident reports...
            // 'location.lat': newReport.location.lat,
            // 'location.long': newReport.location.long,
            'transport.transportType': newReport.transport.transportType,
            'transport.transportTag': newReport.transport.transportTag,
            'transport.transportDirection': newReport.transport.transportDirection
        })
        if (Object.keys(report).length > 0) {
            throw new ApiError('This incident has already been reported!', 409)
        }
        return await new Report(newReport).save()
    }

    async getFiltered(params) {
        const possibleParameters = ['author', 'location', 'lat', 'long', 'transportType', 'transportTag', 'transportDirection']
        let query = {}
        possibleParameters.forEach(param => {
            if (params[param] !== undefined) {
                switch (param) {
                    case 'lat':
                    case 'long':
                        query['location.' + param] = params[param]
                        break
                    case 'transportType':
                    case 'transportTag':
                    case 'transportDirection':
                        query['transport.' + param] = params[param]
                        break
                    default:
                        query[param] = params[param]
                }
            }
        })
        if (Object.keys(query).length === 0) {
            throw new ApiError('Please provide at least one valid query parameter!', 400)
        }
        return await Report.find(query)
    }

    async getSpecific(reportId) {
        const report = await Report.findById(reportId)
        if (!report) {
            throw new ApiError('Report ID not found!', 404)
        }
        return report
    }

    async delete(reportId) {
        const report = await this.getSpecific(reportId)
        return await Report.findByIdAndRemove(report._id)
    }

    async upvote(reportId) {
        const report = await this.getSpecific(reportId)
        // calculate new upvote value
        const newUpvotes = report.metadata.upvotes + 1
        return await Report.updateOne({
            _id: reportId
        }, {
            'metadata.upvotes': newUpvotes
        })
    }

    async downvote(reportId) {
        const report = await this.getSpecific(reportId)
        // calculate new downvote value
        const newDownvotes = report.metadata.downvotes + 1
        return await Report.updateOne({
            _id: reportId
        }, {
            'metadata.downvotes': newDownvotes
        })
    }

    async createComment(reportId, body) {
        const report = await this.getSpecific(reportId)
        // check if body contains all required parameters
        const possibleParameters = ['author', 'content']
        possibleParameters.forEach(param => {
            if (body[param] === undefined) {
                throw new ApiError(`${param} is missing!`, 400)
            }
        })
        // making sure the comment only consists of the allowed insert params
        const comment = {}
        Object.keys(this.createCommentModel).forEach(key => comment[key] = body[key])
        const newComment = report.comments.create(comment)
        report.comments.push(newComment)
        const updatedReport = await report.save()

        if (updatedReport)
            return newComment
    }

    async getByCommentId(commentId) {
        const report = await Report.findOne({
            'comments._id': commentId
        })
        if (!report) {
            throw new ApiError(`No Report found containing comment with ID ${commentId}!`, 404)
        }
        return report
    }
}

module.exports = new ReportController()
const Report = require('../models/reportSchema');
const UserController = require('./userController');
const ApiError = require('../exceptions/apiExceptions');
const GeodataService = require('../services/geodataService');

class ReportController {
    constructor() {
        // report model with allowed insert params
        this.createReportModel = {
            author: undefined,
            description: undefined,
            location: {
                lat: undefined,
                long: undefined,
                city: undefined
            },
            transport: {
                transportType: undefined,
                transportTag: undefined,
                transportDirection: undefined,
            }
        };
        this.createCommentModel = {
            author: undefined,
            content: undefined
        };
    }

    async create(body) {
        // check if author exists
        await UserController.getByUsername(body.author);
        // making sure the report only consists of the allowed insert params
        const newReport = {};
        Object.keys(this.createReportModel).forEach(key => newReport[key] = body[key]);
        // getting city from geodata
        try {
            // eslint-disable-next-line require-atomic-updates
            newReport.location.city = await GeodataService.getCityFromGeodata(newReport.location.lat, newReport.location.long);
        } catch (error) {
            throw new ApiError('City could not be retrieved from the location coordinates!', 400);
        }
        // getting car transportTag from geodata
        if (newReport.transport.transportType == 'car') {
            try {
                // eslint-disable-next-line require-atomic-updates
                newReport.transport.transportTag = await GeodataService.getStreetFromGeodata(newReport.location.lat, newReport.location.long);
            } catch (error) {
                throw new ApiError('TransportTag could not be retrieved from the location coordinates!', 400);
            }
        }
        // check if similar report already exists
        const report = await Report.find({
            'location.city': newReport.location.city,
            'transport.transportType': newReport.transport.transportType,
            'transport.transportTag': newReport.transport.transportTag,
            'transport.transportDirection': newReport.transport.transportDirection
        });
        if (Object.keys(report).length > 0) {
            throw new ApiError('This incident has already been reported!', 409);
        }
        return await new Report(newReport).save();
    }

    async getFiltered(params) {
        // getting city from geodata if only lat & long were provided
        if (params.lat && params.long && !params.city) {
            try {
                // eslint-disable-next-line require-atomic-updates
                params.city = await GeodataService.getCityFromGeodata(params.lat, params.long);
            } catch (error) {
                throw new ApiError('City could not be retrieved from the location coordinates!', 400);
            }
        }
        const possibleParameters = ['author', 'city', 'transportType', 'transportTag', 'transportDirection', 'active', 'verified'];
        let query = {};
        possibleParameters.forEach(param => {
            if (params[param] !== undefined) {
                switch (param) {
                    case 'city':
                        query['location.' + param] = params[param];
                        break;
                    case 'transportType':
                    case 'transportTag':
                    case 'transportDirection':
                        query['transport.' + param] = params[param];
                        break;
                    case 'active':
                    case 'verified':
                        query['metadata.' + param] = params[param];
                        break;
                    default:
                        query[param] = params[param];
                }
            }
        });
        if (Object.keys(query).length === 0) {
            throw new ApiError('Please provide at least one valid query parameter!', 400);
        }
        return await Report.find(query);
    }

    async getSpecific(reportId) {
        const report = await Report.findById(reportId);
        if (!report) {
            throw new ApiError('Report ID not found!', 404);
        }
        return report;
    }

    async delete(reportId) {
        const report = await this.getSpecific(reportId);
        return await Report.findByIdAndRemove(report._id);
    }

    async upvote(reportId) {
        const report = await this.getSpecific(reportId);
        // calculate new upvote value
        const newUpvotes = report.metadata.upvotes + 1;
        return await Report.updateOne({
            _id: reportId
        }, {
            'metadata.upvotes': newUpvotes
        });
    }

    async downvote(reportId) {
        const report = await this.getSpecific(reportId);
        // calculate new downvote value
        const newDownvotes = report.metadata.downvotes + 1;
        return await Report.updateOne({
            _id: reportId
        }, {
            'metadata.downvotes': newDownvotes
        });
    }

    async updateVerificationState(reportId) {
        const report = await this.getSpecific(reportId);
        const downvotes = report.metadata.downvotes;
        const upvotes = report.metadata.upvotes;
        const threshold = process.env.VERIFICATION_THRESHOLD;
        // check new verification state
        const newVerified = ((upvotes > (downvotes * threshold)) || (upvotes > (2 * threshold) && downvotes < 2));
        // update if state has changed
        if (newVerified !== report.metadata.verified) {
            console.debug(`updating ${reportId}`);
            return await Report.updateOne({
                _id: reportId
            }, {
                'metadata.verified': newVerified
            });
        }
    }

    async updateActiveState(reportId) {
        const report = await this.getSpecific(reportId);
        const activityCheckTime = new Date();
        activityCheckTime.setMinutes(activityCheckTime.getMinutes() - process.env.REPORT_ACTIVITY_CHECK_EVERY);
        // set report to inactive if older than defined activity duration
        if (report.modified < activityCheckTime) {
            console.debug(`deactivating ${reportId}`);
            return await Report.updateOne({
                _id: reportId
            }, {
                'metadata.active': false
            });
        }
    }

    async createComment(reportId, body) {
        // check if author exists
        await UserController.getByUsername(body.author);
        const report = await this.getSpecific(reportId);
        // check if body contains all required parameters
        const possibleParameters = ['author', 'content'];
        possibleParameters.forEach(param => {
            if (body[param] === undefined) {
                throw new ApiError(`${param} is missing!`, 400);
            }
        });
        // making sure the comment only consists of the allowed insert params
        const comment = {};
        Object.keys(this.createCommentModel).forEach(key => comment[key] = body[key]);
        // create new comment and push in comments array
        const newComment = report.comments.create(comment);
        report.comments.push(newComment);
        await report.save();
        return newComment;
    }

    async getByCommentId(commentId) {
        const report = await Report.findOne({
            'comments._id': commentId
        });
        if (!report) {
            throw new ApiError(`No Report found containing comment with ID ${commentId}!`, 404);
        }
        return report;
    }
}

module.exports = new ReportController();
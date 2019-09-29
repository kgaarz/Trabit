const {
    Report
} = require('../models/reportSchema');
const {
    Votes
} = require('../models/reportSchema');
const UserController = require('./userController');
const GeodataService = require('../services/geodataService');
const ApiError = require('../exceptions/apiExceptions');

class ReportController {
    constructor() {
        this.createCommentModel = {
            author: undefined,
            content: undefined
        };
    }

    async create(body) {
        // check if author exists
        await UserController.getByUsername(body.author);
        return await new Report(body).save();
    }

    async getFiltered(params) {
        // getting city from geodata if only lat & lng were provided (origin & destination)
        if (params.originLat && params.originLng && !params.originCity) {
            try {
                // eslint-disable-next-line require-atomic-updates
                params.originCity = await GeodataService.getCityFromGeodata(params.originLat, params.originLng);
            } catch (error) {
                throw new ApiError('City could not be retrieved from the origin location coordinates!', 400);
            }
        }
        if (params.destinationLat && params.destinationLat && !params.destinationCity) {
            try {
                // eslint-disable-next-line require-atomic-updates
                params.destinationCity = await GeodataService.getCityFromGeodata(params.destinationLat, params.destinationLat);
            } catch (error) {
                throw new ApiError('City could not be retrieved from the destination location coordinates!', 400);
            }
        }
        const possibleParameters = ['author', 'originCity', 'destinationCity', 'transportType', 'transportTag', 'active', 'verified'];
        let query = {};
        possibleParameters.forEach(param => {
            if (params[param] !== undefined) {
                switch (param) {
                    case 'author':
                        query[param] = {
                            $regex: new RegExp("^" + params[param] + "$", "i")
                        };
                        break;
                    case 'originCity':
                    case 'destinationCity':
                        query['location.' + param.replace('City', '.city')] = {
                            $regex: new RegExp("^" + params[param] + "$", "i")
                        };
                        break;
                    case 'transportType':
                    case 'transportTag':
                        query[param.replace('transport', 'transport.').toLowerCase()] = {
                            $regex: new RegExp("^" + params[param] + "$", "i")
                        };
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
        return await Report.find(query).sort("-created");
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

    async getVotes(type, reportId) {
        const report = await this.getSpecific(reportId);
        return report.metadata[type];
    }

    async addVote(type, reportId, userId) {
        const report = await this.getSpecific(reportId);
        await UserController.getSpecific(userId);
        const antiType = type == 'upvotes' ? 'downvotes' : 'upvotes';
        // check if vote for antiType exists & remove if applicable
        if (report.metadata[antiType].users.includes(userId)) {
            await this.removeVote(antiType, report._id, userId);
        }
        if (!report.metadata[type].users.includes(userId)) {
            const newAmount = report.metadata[type].users.push(userId);
            const newVotes = new Votes({
                amount: newAmount,
                users: report.metadata[type].users
            });
            switch (type) {
                case "upvotes":
                    await Report.updateOne({
                        _id: report._id
                    }, {
                        "metadata.upvotes": newVotes
                    });
                    break;
                case "downvotes":
                    await Report.updateOne({
                        _id: report._id
                    }, {
                        "metadata.downvotes": newVotes
                    });
                    break;
                default:
                    throw new ApiError(`Type "${type}" not supported!`, 400);
            }
        }
        return 204;
    }

    async removeVote(type, reportId, userId) {
        const report = await this.getSpecific(reportId);
        await UserController.getSpecific(userId);
        if (report.metadata[type].users.includes(userId)) {
            const newUsers = report.metadata[type].users.filter(user => user !== userId);
            const newVotes = new Votes({
                amount: newUsers.length,
                users: newUsers
            });
            switch (type) {
                case "upvotes":
                    await Report.updateOne({
                        _id: report._id
                    }, {
                        "metadata.upvotes": newVotes
                    });
                    break;
                case "downvotes":
                    await Report.updateOne({
                        _id: report._id
                    }, {
                        "metadata.downvotes": newVotes
                    });
                    break;
                default:
                    throw new ApiError(`Type "${type}" not supported!`, 400);
            }
            return 204;
        } else {
            return 404;
        }
    }

    async updateVerificationState(reportId) {
        const report = await this.getSpecific(reportId);
        const downvotes = report.metadata.downvotes.amount;
        const upvotes = report.metadata.upvotes.amount;
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
        await Report.updateOne({
            _id: reportId
        }, {
            comments: report.comments
        });
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
const {
    Report
} = require('../models/reportSchema');
const {
    Votes
} = require('../models/reportSchema');
const UserController = require('./userController');
const ReportController = require('../controllers/reportController');
const ApiError = require('../exceptions/apiExceptions');

class CommentController {
    async delete(commentId) {
        const report = await ReportController.getByCommentId(commentId);
        const comment = report.comments.id(commentId);
        return await Report.updateOne({
            _id: report._id,
        }, {
            $pull: {
                comments: comment
            }
        });
    }

    async getVotes(type, commentId) {
        const report = await ReportController.getByCommentId(commentId);
        const comment = report.comments.id(commentId);
        return comment.metadata[type];
    }

    async addVote(type, commentId, userId) {
        const report = await ReportController.getByCommentId(commentId);
        const comment = report.comments.id(commentId);
        await UserController.getSpecific(userId);
        const antiType = type == 'upvotes' ? 'downvotes' : 'upvotes';
        // check if vote for antiType exists & remove if applicable
        if (comment.metadata[antiType].users.includes(userId)) {
            await this.removeVote(antiType, commentId, userId);
        }
        if (!comment.metadata[type].users.includes(userId)) {
            const newAmount = comment.metadata[type].users.push(userId);
            const newVotes = new Votes({
                amount: newAmount,
                users: comment.metadata[type].users
            });
            switch (type) {
                case "upvotes":
                    await Report.updateOne({
                        _id: report._id,
                        "comments._id": commentId
                    }, {
                        "comments.$.metadata.upvotes": newVotes
                    });
                    break;
                case "downvotes":
                    await Report.updateOne({
                        _id: report._id,
                        "comments._id": commentId
                    }, {
                        "comments.$.metadata.downvotes": newVotes
                    });
                    break;
                default:
                    throw new ApiError(`Type "${type}" not supported!`, 400);
            }
        }
        return 204;
    }

    async removeVote(type, commentId, userId) {
        const report = await ReportController.getByCommentId(commentId);
        const comment = report.comments.id(commentId);
        await UserController.getSpecific(userId);
        if (comment.metadata[type].users.includes(userId)) {
            const newUsers = comment.metadata[type].users.filter(user => user !== userId);
            const newVotes = new Votes({
                amount: newUsers.length,
                users: newUsers
            });
            switch (type) {
                case "upvotes":
                    await Report.updateOne({
                        _id: report._id,
                        "comments._id": commentId
                    }, {
                        "comments.$.metadata.upvotes": newVotes
                    });
                    break;
                case "downvotes":
                    await Report.updateOne({
                        _id: report._id,
                        "comments._id": commentId
                    }, {
                        "comments.$.metadata.downvotes": newVotes
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
}

module.exports = new CommentController();
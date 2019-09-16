const Report = require('../models/reportSchema');
const ReportController = require('../controllers/reportController');

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

    async upvote(commentId) {
        const report = await ReportController.getByCommentId(commentId);
        const comment = report.comments.id(commentId);
        // calculate new upvote value
        const newUpvotes = comment.metadata.upvotes + 1;
        return await Report.updateOne({
            _id: report._id,
            "comments._id": commentId
        }, {
            "comments.$.metadata.upvotes": newUpvotes
        });
    }

    async downvote(commentId) {
        const report = await ReportController.getByCommentId(commentId);
        const comment = report.comments.id(commentId);
        // calculate new downvote value
        const newDownvotes = comment.metadata.downvotes + 1;
        return await Report.updateOne({
            _id: report._id,
            "comments._id": commentId
        }, {
            "comments.$.metadata.downvotes": newDownvotes
        });
    }
}

module.exports = new CommentController();
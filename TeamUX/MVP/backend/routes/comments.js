const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/commentController');

// delete comment
router.delete('/comments/:commentId', async (req, res) => {
    try {
        res.status(204).send(await CommentController.delete(req.params.commentId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// get upvotes
router.get('/comments/:commentId/upvotes', async (req, res) => {
    try {
        res.status(200).send(await CommentController.getVotes('upvotes', req.params.commentId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// get downvotes
router.get('/comments/:commentId/downvotes', async (req, res) => {
    try {
        res.status(200).send(await CommentController.getVotes('downvotes', req.params.commentId));
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// add upvote
router.put('/comments/:commentId/upvotes', async (req, res) => {
    try {
        const userId = req.header('userId');
        const statusCode = await CommentController.addVote('upvotes', req.params.commentId, userId);
        res.status(statusCode).send();
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// add downvote
router.put('/comments/:commentId/downvotes', async (req, res) => {
    try {
        const userId = req.header('userId');
        const statusCode = await CommentController.addVote('downvotes', req.params.commentId, userId);
        res.status(statusCode).send();
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// remove upvote
router.delete('/comments/:commentId/upvotes', async (req, res) => {
    try {
        const userId = req.header('userId');
        const statusCode = await CommentController.removeVote('upvotes', req.params.commentId, userId);
        res.status(statusCode).send();
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

// remove downvote
router.delete('/comments/:commentId/downvotes', async (req, res) => {
    try {
        const userId = req.header('userId');
        const statusCode = await CommentController.removeVote('downvotes', req.params.commentId, userId);
        res.status(statusCode).send();
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message);
    }
});

module.exports = router;
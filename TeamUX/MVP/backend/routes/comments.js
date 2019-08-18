const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/commentController')

// delete comment
router.delete('/comments/:commentId', async (req, res) => {
    try {
        res.status(204).send(await CommentController.delete(req.params.commentId))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

// increment upvotes
router.patch('/comments/:commentId/upvotes', async (req, res) => {
    try {
        res.status(204).send(await CommentController.upvote(req.params.commentId))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

// increment downvotes
router.patch('/comments/:commentId/downvotes', async (req, res) => {
    try {
        res.status(204).send(await CommentController.downvote(req.params.commentId))
    } catch (error) {
        res.status(error.statusCode ? error.statusCode : 500).json(error.message)
    }
})

module.exports = router
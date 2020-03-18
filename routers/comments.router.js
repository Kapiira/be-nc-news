const commentsRouter = require('express').Router();
const {
  patchCommentById,
  removeCommentById
} = require('../controllers/comments.controller');

commentsRouter.patch('/:comment_id', patchCommentById);
commentsRouter.delete('/:comment_id', removeCommentById);

module.exports = commentsRouter;

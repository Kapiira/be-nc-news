const commentsRouter = require('express').Router();
const {
  patchCommentById,
  removeCommentById
} = require('../controllers/comments.controller');
const { methodNotFound } = require('../error_handling/user.errors');

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(removeCommentById)
  .all(methodNotFound);

module.exports = commentsRouter;

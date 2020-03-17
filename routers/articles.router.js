const articlesRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  getCommentsByArticleId,
  postComment
} = require('../controllers/articles.controller');

articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', patchArticleById);

articlesRouter.get('/:article_id/comments', getCommentsByArticleId);
articlesRouter.post('/:article_id/comments', postComment);

module.exports = articlesRouter;

const articlesRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  getCommentsByArticleId,
  postComment,
  getArticles
} = require('../controllers/articles.controller');
const { methodNotFound } = require('../error_handling/user.errors');

articlesRouter
  .route('/')
  .get(getArticles)
  .all(methodNotFound);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(methodNotFound);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment)
  .all(methodNotFound);

module.exports = articlesRouter;

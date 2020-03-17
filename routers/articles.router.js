const articlesRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById
} = require('../controllers/articles.controller');

articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', patchArticleById);

module.exports = articlesRouter;

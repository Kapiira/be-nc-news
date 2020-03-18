const {
  selectArticles,
  selectArticleById,
  updateArticleById,
  selectCommentsByArticleId,
  insertComment
} = require('../models/articles.models.js');

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, author } = req.query;
  selectArticles(sort_by, order, topic, author)
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then(article => {
      res.send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then(article => {
      res.send({ article });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  insertComment(article_id, req.body)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

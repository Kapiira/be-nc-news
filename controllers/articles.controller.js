const { selectArticleById } = require('../models/articles.models.js');

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id).then(article => {
    res.send({ article });
  });
};

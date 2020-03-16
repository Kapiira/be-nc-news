const knex = require('../db/connection');

exports.selectArticleById = article_id => {
  return knex('articles')
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', article_id)
    .groupBy('articles.article_id')
    .then(articleArr => {
      // if (userArr.length === 0) {
      //   return Promise.reject({ code: 404, resource: 'User' });
      // }
      return articleArr[0];
    });
};

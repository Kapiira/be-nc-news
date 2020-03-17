const knex = require('../db/connection');

exports.selectArticleById = article_id => {
  return knex('articles')
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .where('articles.article_id', article_id)
    .groupBy('articles.article_id')
    .then(articleArr => {
      if (articleArr.length === 0) {
        return Promise.reject({ code: 404, resource: 'Article' });
      }
      return articleArr[0];
    });
};

exports.updateArticleById = (article_id, body) => {
  return knex('articles')
    .increment({ votes: body.inc_votes })
    .where({ article_id })
    .returning('*')
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({ code: 404, resource: 'Article' });
      }
      return articles[0];
    });
};

exports.selectCommentsByArticleId = article_id => {
  return knex('comments')
    .select('author', 'body', 'comment_id', 'created_at', 'votes')
    .where({ article_id })
    .orderBy('created_at', 'desc');
};

exports.insertComment = (article_id, body) => {
  return knex('comments')
    .insert({
      author: body.username,
      body: body.body,
      article_id
    })
    .returning('*')
    .then(comments => comments[0]);
};

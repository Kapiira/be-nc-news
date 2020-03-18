const knex = require('../db/connection');

exports.updateCommentById = (comment_id, body) => {
  return knex('comments')
    .increment({ votes: body.inc_votes })
    .where({ comment_id })
    .returning('*')
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({ code: 404, resource: 'Article' });
      }
      return comments[0];
    });
};

exports.deleteCommentById = comment_id => {
  return knex('comments')
    .del()
    .where({ comment_id })
    .then(rowCount => {
      if (rowCount > 0) {
        return rowCount;
      } else {
        return Promise.reject({ code: 404, resource: 'Comment' });
      }
    });
};

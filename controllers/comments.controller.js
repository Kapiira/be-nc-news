const {
  updateCommentById,
  deleteCommentById
} = require('../models/comments.models.js');

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  updateCommentById(comment_id, req.body)
    .then(comment => {
      res.send({ comment });
    })
    .catch(next);
};

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

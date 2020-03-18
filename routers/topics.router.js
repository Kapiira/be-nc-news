const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/topics.controller');
const { methodNotFound } = require('../error_handling/user.errors');

topicsRouter
  .route('/')
  .get(getTopics)
  .all(methodNotFound);

module.exports = topicsRouter;

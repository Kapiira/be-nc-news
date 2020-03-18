const apiRouter = require('express').Router();
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const { getEndpoints } = require('../controllers/api.controller');
const { methodNotFound } = require('../error_handling/user.errors');

apiRouter
  .route('/')
  .get(getEndpoints)
  .all(methodNotFound);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;

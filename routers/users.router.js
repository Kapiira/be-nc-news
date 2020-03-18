const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users.controller');
const { methodNotFound } = require('../error_handling/user.errors');

usersRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(methodNotFound);

module.exports = usersRouter;

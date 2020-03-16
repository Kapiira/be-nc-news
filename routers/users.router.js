const usersRouter = require('express').Router();
const { getUserByUsername } = require('../controllers/users.controller');

usersRouter.get('/:username', getUserByUsername);

module.exports = usersRouter;

const express = require('express');
const app = express();
const apiRouter = require('./routers/api.router');
const userErrors = require('./error_handling/user.errors');

app.use(express.json());

app.use('/api', apiRouter);

app.use(userErrors);

module.exports = app;

const express = require('express');
const app = express();
const apiRouter = require('./routers/api.router');
const { userErrors, pageNotFound } = require('./error_handling/user.errors');
const psqlErrors = require('./error_handling/psql.errors');

const { dbFormat } = require('./db/utils/utils');

app.use(express.json());
app.use(dbFormat);

app.use('/api', apiRouter);

app.use(userErrors);
app.use(psqlErrors);
app.all('*', pageNotFound);

module.exports = app;

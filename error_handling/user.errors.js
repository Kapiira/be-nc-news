module.exports = (err, req, res, next) => {
  if (err.code === 404) {
    res.status(404).send({ message: `${err.resource} not found` });
  } else next(err);
};

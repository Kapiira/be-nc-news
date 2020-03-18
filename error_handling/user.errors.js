exports.userErrors = (err, req, res, next) => {
  if (err.code === 404) {
    res.status(404).send({ message: `${err.resource} not found` });
  } else if (err.code === 400) {
    res.status(400).send({ message: 'bad user input' });
  } else next(err);
};

exports.pageNotFound = (req, res) => {
  res.status(404).send({ message: 'Page not found' });
};

exports.methodNotFound = (req, res) => {
  res.status(405).send({ message: 'method not allowed' });
};

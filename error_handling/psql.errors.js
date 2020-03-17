module.exports = (err, req, res, next) => {
  const psqlErrors = {
    '22P02': { message: 'bad user input' }
  };
  if (psqlErrors[err.code]) {
    const { message } = psqlErrors[err.code];
    res.status(400).send({ message });
  }
};

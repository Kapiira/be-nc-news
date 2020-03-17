module.exports = (err, req, res, next) => {
  // Could do better err-messages if time
  const psqlErrors = {
    '22P02': { code: 400, message: 'bad user input' },
    '23502': { code: 400, message: 'bad user input' },
    '23503': { code: 404, message: 'Resource not found' }
  };
  if (psqlErrors[err.code]) {
    const { code, message } = psqlErrors[err.code];
    res.status(code).send({ message });
  }
};

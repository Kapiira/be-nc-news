const { fetchEndpointsObj } = require('../models/api.models');

exports.getEndpoints = (req, res, next) => {
  fetchEndpointsObj().then(endpoints => {
    res.send({ endpoints });
  });
};

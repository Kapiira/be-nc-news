const { readFile } = require('fs').promises;

exports.fetchEndpointsObj = () => {
  return readFile(`${__dirname}/../endpoints.json`, 'utf-8').then(JSON.parse);
};

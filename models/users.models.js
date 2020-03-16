const knex = require('../db/connection');

exports.selectUserByUsername = username => {
  return knex('users')
    .where('username', username)
    .then(userArr => {
      if (userArr.length === 0) {
        return Promise.reject({ code: 404, resource: 'User' });
      }
      return userArr[0];
    });
};

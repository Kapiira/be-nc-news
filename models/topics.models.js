const knex = require('../db/connection');

exports.selectTopics = () => {
  return knex('topics').select('*');
};

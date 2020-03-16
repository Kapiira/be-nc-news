exports.up = function(knex) {
  return knex.schema.createTable('topics', table => {
    table.string('slug').primary();
    table.string('description');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('topics');
};

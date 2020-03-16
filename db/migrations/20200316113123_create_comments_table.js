exports.up = function(knex) {
  return knex.schema.createTable('comments', table => {
    table.increments('comment_id').primary();
    table.integer('article_id').references('articles.article_id');
    table.text('body').notNullable();
    table.string('author').references('users.username');
    table.integer('votes').defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('comments');
};

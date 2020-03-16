process.env.NODE_ENV = 'test';
const { expect, use } = require('chai');
const request = require('supertest');
const knex = require('../db/connection');
const app = require('../app');
const chaiSorted = require('chai-sorted');

use(chaiSorted);

beforeEach(() => {
  return knex.seed.run();
});

after(() => {
  return knex.destroy();
});

describe('/api', () => {
  describe('/topics', () => {
    it('GET: 200 - Responds with all topics in an object', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.topics).to.be.an('array');
          expect(res.body.topics.length).to.equal(3);
          expect(res.body.topics[0]).to.eql({
            slug: 'mitch',
            description: 'The man, the Mitch, the legend'
          });
        });
    });
  });
  describe('/users', () => {
    describe('/:username', () => {
      it('GET: 200 - Responds with an user object containing the user', () => {
        return request(app)
          .get('/api/users/lurker')
          .expect(200)
          .then(res => {
            expect(res.body.user).to.be.an('object');
            expect(res.body.user).to.eql({
              username: 'lurker',
              name: 'do_nothing',
              avatar_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
            });
          });
      });
      describe('ERRORS', () => {
        it('ERROR: 404 - Responds with not found when user does not exist', () => {
          return request(app)
            .get('/api/users/no-existing-user')
            .expect(404)
            .then(res => {
              expect(res.body.message).to.equal('User not found');
            });
        });
      });
    });
  });
});

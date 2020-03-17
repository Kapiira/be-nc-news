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
  describe('/articles', () => {
    describe('/:article_id', () => {
      it('GET: 200 - Responds with an article object', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(res => {
            expect(res.body.article).to.be.an('object');
            expect(res.body.article).to.eql({
              author: 'butter_bridge',
              title: 'Living in the shadow of a great man',
              article_id: 1,
              body: 'I find this existence challenging',
              topic: 'mitch',
              created_at: '2018-11-15T12:21:54.171Z',
              votes: 100,
              comment_count: 13
            });
          });
      });
      it('PATCH: 200 - Responds with the updated article object when you want to increment', () => {
        return request(app)
          .patch('/api/articles/2')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(res => {
            expect(res.body.article).to.eql({
              article_id: 2,
              title: 'Sony Vaio; or, The Laptop',
              body:
                'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
              votes: 10,
              topic: 'mitch',
              author: 'icellusedkars',
              created_at: '2014-11-16T12:21:54.171Z'
            });
          });
      });
      it('PATCH: 200 - Responds with the updated article object when you want to decrement', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -10 })
          .expect(200)
          .then(res => {
            expect(res.body.article.votes).to.equal(90);
          });
      });
      describe('ERRORS', () => {
        it('GET: 400 - Bad article_id given and responds with an error message', () => {
          return request(app)
            .get('/api/articles/not-valid-id')
            .expect(400)
            .then(res => {
              expect(res.body.message).to.equal('bad user input');
            });
        });
        it('GET: 404 - Valid article_id but no id found matching', () => {
          return request(app)
            .get('/api/articles/0')
            .expect(404)
            .then(res => {
              expect(res.body.message).to.equal('Article not found');
            });
        });
        it('PATCH: 400 - Missing inc_votes in body', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({})
            .expect(400)
            .then(res => {
              expect(res.body.message).to.equal('bad user input');
            });
        });
        it('PATCH: 400 - invalid inc_votes value', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'not-valid' })
            .expect(400)
            .then(res => {
              expect(res.body.message).to.equal('bad user input');
            });
        });
        it('PATCH: 400 - Multiple keys sent in body request', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 10, topic: 'random' })
            .expect(400)
            .then(res => {
              expect(res.body.message).to.equal('bad user input');
            });
        });
        it('PATCH: 400 - invalid article_id', () => {
          return request(app)
            .patch('/api/articles/not-valid-id')
            .send({ inc_votes: 10 })
            .expect(400)
            .then(res => {
              expect(res.body.message).to.equal('bad user input');
            });
        });
        it('PATCH: 404 - article_id not found', () => {
          return request(app)
            .patch('/api/articles/0')
            .send({ inc_votes: 10 })
            .expect(404)
            .then(res => {
              expect(res.body.message).to.equal('Article not found');
            });
        });
      });
      describe('/comments', () => {
        it('POST: 200 - returns the new comment object', () => {
          return request(app)
            .post('/api/articles/1/comments')
            .send({ username: 'lurker', body: 'My First Comment' })
            .expect(201)
            .then(res => {
              expect(res.body.comment).to.be.an('object');
              expect(res.body.comment.article_id).to.equal(1);
              expect(res.body.comment.body).to.equal('My First Comment');
              expect(res.body.comment.comment_id).to.equal(19);
              expect(res.body.comment.author).to.equal('lurker');
              expect(res.body.comment.votes).to.equal(0);
            });
        });
      });
    });
  });
});

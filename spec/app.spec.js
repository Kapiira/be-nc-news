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
  it('Returns an object with all the endpoints and its description', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(res => {
        expect(res.body.endpoints).to.be.an('object');
        expect(res.body.endpoints['DELETE /api/comments/:comment_id']).to.eql({
          description: 'Deletes the comment and returns a status of 204'
        });
      });
  });
  describe('ERRORS', () => {
    it('ERROR: 405, method not found', () => {
      const invalidMethods = ['post', 'patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          [method]('/api/')
          .expect(405)
          .then(res => {
            expect(res.body.message).to.equal('method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
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
    describe('ERRORS', () => {
      it('ERROR: 405, method not found', () => {
        const invalidMethods = ['post', 'patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(res => {
              expect(res.body.message).to.equal('method not allowed');
            });
        });
        return Promise.all(methodPromises);
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
        it('ERROR: 405, method not found', () => {
          const invalidMethods = ['post', 'patch', 'put', 'delete'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/users/lurker')
              .expect(405)
              .then(res => {
                expect(res.body.message).to.equal('method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
  describe('/articles', () => {
    it('GET: 200 - Responds with array of article objects sorted by created_at desc', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(12);
          expect(res.body.articles).to.be.sortedBy('created_at', {
            descending: true
          });
          expect(res.body.articles[0]).to.have.all.keys(
            'author',
            'title',
            'article_id',
            'topic',
            'created_at',
            'votes',
            'comment_count'
          );
        });
    });
    it('GET: 200 - Responds with array of article objects sorted by author desc', () => {
      return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(12);
          expect(res.body.articles).to.be.sortedBy('author', {
            descending: true
          });
        });
    });
    it('GET: 200 - Responds with array of article objects sorted by votes asc', () => {
      return request(app)
        .get('/api/articles?sort_by=votes&order=asc')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(12);
          expect(res.body.articles).to.be.sortedBy('votes', {
            descending: false
          });
        });
    });
    it('GET: 200 - Responds with array of article objects sorted by title asc', () => {
      return request(app)
        .get('/api/articles?sort_by=title&order=asc')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(12);
          expect(res.body.articles).to.be.sortedBy('title', {
            descending: false
          });
        });
    });
    it('GET: 200 - Responds with array of article filtered by topic', () => {
      return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(1);
        });
    });
    it('GET: 200 - Responds with array of article filtered by author', () => {
      return request(app)
        .get('/api/articles?author=rogersop')
        .expect(200)
        .then(res => {
          expect(res.body.articles.length).to.equal(3);
        });
    });
    describe('ERRORS', () => {
      it('ERROR: 400 - sort_by column does not exist', () => {
        return request(app)
          .get('/api/articles?sort_by=non-existing')
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('bad user input');
          });
      });
      it('ERROR: 400 - invalid order by value', () => {
        return request(app)
          .get('/api/articles?order=invalid')
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('bad user input');
          });
      });
      it('ERROR: 404 - author not found', () => {
        return request(app)
          .get('/api/articles?author=non-existing-user')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('Article not found');
          });
      });
      it('ERROR: 404 - topic not found', () => {
        return request(app)
          .get('/api/articles?topic=non-existing-topic')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('Article not found');
          });
      });
      it('ERROR: 405, method not found', () => {
        const invalidMethods = ['post', 'patch', 'put', 'delete'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then(res => {
              expect(res.body.message).to.equal('method not allowed');
            });
        });
        return Promise.all(methodPromises);
      });
    });
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
      it('PATCH: 200 - goes to default of 0 when inc_votes is not passed through in the body', () => {
        return request(app)
          .patch('/api/articles/2')
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.article).to.eql({
              article_id: 2,
              title: 'Sony Vaio; or, The Laptop',
              body:
                'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
              votes: 0,
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

        it('PATCH: 400 - invalid inc_votes value', () => {
          return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 'not-valid' })
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
        it('ERROR: 405, method not found', () => {
          const invalidMethods = ['post', 'put', 'delete'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/articles/1')
              .expect(405)
              .then(res => {
                expect(res.body.message).to.equal('method not allowed');
              });
          });
          return Promise.all(methodPromises);
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
        it('GET: 200 - Returns an array of comment objects sorted by created_at DESC', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an('array');
              expect(res.body.comments[0]).to.eql({
                comment_id: 2,
                votes: 14,
                created_at: '2016-11-22T12:36:03.389Z',
                author: 'butter_bridge',
                body:
                  'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.'
              });
              expect(res.body.comments).to.be.sortedBy('created_at', {
                descending: true
              });
            });
        });
        it('GET: 200 - Returns an array of comment objects sorted by created_at ASC', () => {
          return request(app)
            .get('/api/articles/1/comments?order=asc')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an('array');
              expect(res.body.comments).to.be.sortedBy('created_at');
            });
        });
        it('GET: 200 - Returns an array of comment objects sorted by comment_id ASC', () => {
          return request(app)
            .get('/api/articles/1/comments?order=asc&sort_by=comment_id')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an('array');
              expect(res.body.comments).to.be.sortedBy('comment_id');
            });
        });
        it('GET: 200 - Returns an array of comment objects sorted by author desc', () => {
          return request(app)
            .get('/api/articles/1/comments?order=desc&sort_by=author')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an('array');
              expect(res.body.comments).to.be.sortedBy('author', {
                descending: true
              });
            });
        });
        it('GET: 200 - Returns an empty array when no comments belongs to an article', () => {
          return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(res => {
              expect(res.body.comments).to.be.an('array');
              expect(res.body.comments.length).to.equal(0);
            });
        });
        describe('ERRORS', () => {
          it('POST: 400 - empty body sent', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({})
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('bad user input');
              });
          });
          it('POST: 400 - only comment_body sent', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ body: 'My First Comment' })
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('bad user input');
              });
          });
          it('POST: 400 - only username sent', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ username: 'lurker' })
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('bad user input');
              });
          });
          it('POST: 404 - user does not exist in db', () => {
            return request(app)
              .post('/api/articles/1/comments')
              .send({ body: 'My First Comment', username: 'non-existing-user' })
              .expect(404)
              .then(res => {
                expect(res.body.message).to.equal('Resource not found');
              });
          });
          it('POST: 400 - invalid article_id', () => {
            return request(app)
              .post('/api/articles/not-valid-id/comments')
              .send({
                body: 'My First Comment',
                username: 'lurker'
              })
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('bad user input');
              });
          });
          it('POST: 404 - article_id not existing in db', () => {
            return request(app)
              .post('/api/articles/0/comments')
              .send({
                body: 'My First Comment',
                username: 'lurker'
              })
              .expect(404)
              .then(res => {
                expect(res.body.message).to.equal('Resource not found');
              });
          });
          it('GET: 400 - invalid article_id', () => {
            return request(app)
              .get('/api/articles/not-valid-id/comments')
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('bad user input');
              });
          });
          it('GET: 400 - invalid order value in query', () => {
            return request(app)
              .get('/api/articles/1/comments?order=not-valid')
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('bad user input');
              });
          });
          it('GET: 400 - invalid sort_by column', () => {
            return request(app)
              .get('/api/articles/1/comments?sort_by=not-valid')
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('bad user input');
              });
          });
          it('ERROR: 405, method not found', () => {
            const invalidMethods = ['patch', 'put', 'delete'];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]('/api/articles/1/comments')
                .expect(405)
                .then(res => {
                  expect(res.body.message).to.equal('method not allowed');
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });
  describe('/comments', () => {
    describe('/:comment_id', () => {
      it('PATCH: 200 - Responds with the updated comment object when you want to increment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 10 })
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.eql({
              comment_id: 1,
              article_id: 9,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              author: 'butter_bridge',
              votes: 26,
              created_at: '2017-11-22T12:36:03.389Z'
            });
          });
      });
      it('PATCH: 200 - Responds with the updated comment object when you want to decrement', () => {
        return request(app)
          .patch('/api/comments/2')
          .send({ inc_votes: -4 })
          .expect(200)
          .then(res => {
            expect(res.body.comment.votes).to.equal(10);
          });
      });
      it('PATCH: 400 - Sends back an unchanged comment object when inc_votes is not passed through', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({})
          .expect(200)
          .then(res => {
            expect(res.body.comment).to.eql({
              article_id: 9,
              author: 'butter_bridge',
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              comment_id: 1,
              created_at: '2017-11-22T12:36:03.389Z',
              votes: 16
            });
          });
      });
      it('DELETE: 204 - with valid id', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204);
      });
      describe('ERRORS', () => {
        it('PATCH: 400 - invalid inc_votes value', () => {
          return request(app)
            .patch('/api/comments/1')
            .send({ inc_votes: 'not-valid' })
            .expect(400)
            .then(res => {
              expect(res.body.message).to.equal('bad user input');
            });
        });
        it('PATCH: 400 - invalid article_id', () => {
          return request(app)
            .patch('/api/comments/not-valid-id')
            .send({ inc_votes: 10 })
            .expect(400)
            .then(res => {
              expect(res.body.message).to.equal('bad user input');
            });
        });
        it('PATCH: 404 - article_id not found', () => {
          return request(app)
            .patch('/api/comments/0')
            .send({ inc_votes: 10 })
            .expect(404)
            .then(res => {
              expect(res.body.message).to.equal('Article not found');
            });
        });
        it('ERROR: 404 - with non existing id', () => {
          return request(app)
            .delete('/api/comments/0')
            .expect(404);
        });
        it('ERROR: 405, method not found', () => {
          const invalidMethods = ['get', 'put', 'post'];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]('/api/comments/1')
              .expect(405)
              .then(res => {
                expect(res.body.message).to.equal('method not allowed');
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
  describe('ERRORS', () => {
    it('GET /api/not-valid-endpoint - 404 not found', () => {
      return request(app)
        .get('/api/not-valid-endpoint')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('Page not found');
        });
    });
  });
});

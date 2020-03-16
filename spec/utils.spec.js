const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('Returns a new array with an object in it', () => {
    const input = [{}];
    const actual = formatDates(input, 'created_at');
    expect(actual).to.eql([{}]);
    expect(actual).to.not.equal(input);
  });
  it('Returns an array with an object where the timestamp has been changed to javascript date object', () => {
    const created_at = +new Date();
    const actual = formatDates([{ created_at }], 'created_at');
    expect(actual[0].created_at).to.eql(new Date(created_at));
  });
  it('Returns a new array with an object where the timestamp has changed but the others has not', () => {
    const input = [
      {
        name: 'Hannes',
        random: 'this is random',
        created_at: +new Date()
      }
    ];
    const actual = formatDates(input, 'created_at');
    const expected = [
      {
        name: 'Hannes',
        random: 'this is random',
        created_at: new Date(input[0].created_at)
      }
    ];
    expect(actual).to.eql(expected);
  });
  it('Returns a new array with many objects where the timestamp has changed but the others has not', () => {
    const input = [
      {
        name: 'Hannes',
        random: 'this is random',
        created_at: +new Date()
      },
      {
        name: 'Hannes2',
        random: 'this is random',
        created_at: +new Date()
      }
    ];
    const actual = formatDates(input, 'created_at');
    const expected = [
      {
        name: 'Hannes',
        random: 'this is random',
        created_at: new Date(input[0].created_at)
      },
      {
        name: 'Hannes2',
        random: 'this is random',
        created_at: new Date(input[1].created_at)
      }
    ];
    expect(actual).to.eql(expected);
  });
});

describe('makeRefObj', () => {
  it('Returns an object', () => {
    const actual = makeRefObj([]);
    expect(actual).to.be.an('object');
  });
  it('Returns an object where key is title and value is article_id', () => {
    const actual = makeRefObj(
      [{ article_id: 1, title: 'A' }],
      'title',
      'article_id'
    );
    expect(actual).to.eql({ A: 1 });
  });
  it('Returns an reference object with multiple keys when bigger array is sent', () => {
    const input = [
      { article_id: 1, title: 'A' },
      { article_id: 2, title: 'B' },
      { article_id: 3, title: 'C' }
    ];
    const actual = makeRefObj(input, 'title', 'article_id');
    expect(actual).to.eql({ A: 1, B: 2, C: 3 });
  });
});

describe('formatComments', () => {
  const articleRef = {
    A: 1,
    B: 2,
    C: 3
  };
  it('Returns a new array with formatted comment object in it', () => {
    const commentObj = {
      body: 'Test body',
      belongs_to: 'A',
      created_by: 'hannes',
      votes: 14,
      created_at: +new Date()
    };
    const actual = formatComments([commentObj], articleRef);
    const expected = [
      {
        body: 'Test body',
        article_id: 1,
        author: 'hannes',
        votes: 14,
        created_at: new Date(commentObj.created_at)
      }
    ];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(commentObj);
  });
  it('Returns a new array with formatted comment objects in it', () => {
    const commentObj = [
      {
        body: 'Test body',
        belongs_to: 'A',
        created_by: 'hannes',
        votes: 14,
        created_at: +new Date()
      },
      {
        body: 'Test body 2',
        belongs_to: 'B',
        created_by: 'hannes',
        votes: 5,
        created_at: +new Date()
      }
    ];
    const actual = formatComments(commentObj, articleRef);
    const expected = [
      {
        body: 'Test body',
        article_id: 1,
        author: 'hannes',
        votes: 14,
        created_at: new Date(commentObj[0].created_at)
      },
      {
        body: 'Test body 2',
        article_id: 2,
        author: 'hannes',
        votes: 5,
        created_at: new Date(commentObj[1].created_at)
      }
    ];
    expect(actual).to.eql(expected);
    expect(actual).to.not.equal(commentObj);
  });
});

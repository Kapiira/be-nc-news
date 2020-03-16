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

describe('makeRefObj', () => {});

describe('formatComments', () => {});

// 2020-03-16 12:16:46.564913+00

exports.formatDates = (list, keyToConvert) => {
  return list.map(item => {
    const newItem = {};
    for (const key in item) {
      if (key === keyToConvert) {
        newItem[key] = new Date(item[key]);
      } else newItem[key] = item[key];
    }
    return newItem;
  });
};

exports.makeRefObj = (list, toUseAsKey, toUseAsValue) => {
  const returnObj = {};
  list.forEach(object => {
    if (
      object.hasOwnProperty(toUseAsKey) &&
      returnObj[object[toUseAsKey]] === undefined
    ) {
      returnObj[object[toUseAsKey]] = object[toUseAsValue];
    }
  });
  return returnObj;
};

exports.formatComments = (comments, articleRef) => {
  const commentsFormattedDate = exports.formatDates(comments, 'created_at');
  return commentsFormattedDate.map(comment => {
    return {
      article_id: articleRef[comment.belongs_to],
      author: comment.created_by,
      body: comment.body,
      votes: comment.votes,
      created_at: comment.created_at
    };
  });
};

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

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};

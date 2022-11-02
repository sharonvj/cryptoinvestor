/**
 * Method for Sort
 * @param {data} - list of data
 * @param {groupBy} - sort by key
 * @returns {list of sorted data}
 */

const sort = (data, sortBy, orderBy = 'desc') => {
  const order = orderBy === 'desc' ? 1 : -1;
  return data.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 * order : -1 * order));
};

/**
 * Method for Search
 * @param {data} - list of data
 * @param {groupBy} - search by key
 * @returns {list of sorted data}
 */

const search = (data, searchBy, searchTxt) => data.filter((each) => each[searchBy] === searchTxt);

/**
 * Method for Grouping
 * @param {data} - list of input data
 * @param {groupBy} - group by key
 * @returns {list of grouped data}
 */

const group = (data, groupBy = 'token') => data.reduce((acc, currentValue) => {
  (acc[currentValue[groupBy]] = acc[currentValue[groupBy]] || []).push(currentValue);
  return acc;
}, {});

module.exports = {
  sort,
  search,
  group
};



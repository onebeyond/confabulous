const { mergeDeepRight } = require('ramda');

function merge(...configs) {
  return configs.reduce((wip, current = {}) => {
    return mergeDeepRight(wip, current);
  });
}

module.exports = merge;

'use strict';

const utils = require('./utils');

module.exports = (ast, options = {}) => {
  const stack = [ast];
  const output = [];

  while (stack.length > 0) {
    const node = stack.pop();
    const invalidNode = node.invalid === true && options.escapeInvalid === true;

    if (node.value) {
      if (invalidNode && utils.isOpenOrClose(node)) {
        output.push('\\' + node.value);
        continue;
      }
      output.push(node.value);
      continue;
    }

    if (node.nodes) {
      for (let i = node.nodes.length - 1; i >= 0; i--) {
        stack.push(node.nodes[i]);
      }
    }
  }

  return output.join('');
};


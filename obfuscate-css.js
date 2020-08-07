const fs = require('fs');
const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

function* idGenerator(n) {
  let i = n;
  while (true) {
    yield i;
    i += 1;
  }
}

function getObfuscatedClassName(className) {
  const value = Iterator.next().value;
  const seed = 'cmw';
  return `${seed}-${value}`;
}

function memoize(fn) {
  const memoizedResults = {};
  return function (arg) {
    if (memoizedResults[arg] !== undefined) {
      return memoizedResults[arg];
    } else {
      const results = fn.apply(this, arguments);
      memoizedResults[arg] = results;
      return memoizedResults[arg];
    }
  };
}

const sourceMap = {};
const Iterator = idGenerator(1);

module.exports = postcss.plugin('postcss-obfuscate', function (options) {
  return (root) => {
    // Transform CSS AST here
    root.walkRules(rule => {
      // Transform each rule here
      const cssClassName = rule.selector;
      if (cssClassName.startsWith('.')) {
        const obfuscatedClass = getObfuscatedClassName(cssClassName);
        sourceMap[cssClassName] = obfuscatedClass;
        rule.selector = `.${obfuscatedClass}`;
      }
      else {
        sourceMap[cssClassName] = cssClassName;
      }
    });
    fs.writeFileSync('./source-map.json', JSON.stringify(sourceMap), 'utf-8');
  };
});

const fs = require('fs');
const postcss = require('postcss');

const sourceMap = JSON.parse(fs.readFileSync('./source-map.json', 'utf-8'));

module.exports = postcss.plugin('postcss-obfuscate-dev', function (options) {
  return (root) => {
    // Transform CSS AST here
    root.walkRules(rule => {
      // Transform each rule here
      const cssClassName = rule.selector;
      const obfuscatedClass = sourceMap[cssClassName] || sourceMap[cssClassName+cssClassName];
      rule.selector = obfuscatedClass ? `.${obfuscatedClass}` : cssClassName;
    });
  };
});

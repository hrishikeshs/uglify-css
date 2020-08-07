const fs = require('fs');

const sourceMap = JSON.parse(fs.readFileSync('./source-map.json', 'utf-8'));

module.exports = function({ source, path }, { parse, visit }) {
  const ast = parse(source);
  const tree = visit(ast, env => {
    let { builders: b } = env.syntax;
    return {
      ElementNode(node) {
        let { attributes } = node;
        if (attributes.length && attributes[0].name === "class") {
          const classNames = attributes[0].value.chars;
          const classes = classNames && classNames.split(' ');
          attributes[0].value.chars = '';
          (classes || []).forEach((className) => {
            const obfuscatedName = sourceMap['.' + className] || className;
            const classNamesSoFar = attributes[0].value.chars;
            attributes[0].value.chars = (classNamesSoFar + ' ' + obfuscatedName).trim();
          });
          return node;
        } else {
          return node;
        }
      }
    };
  });
  return tree;
};

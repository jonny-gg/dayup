const css = require("css");
module.exports.addCSSRules = (text, rules = []) => {
  // 把CSS规则暂存到一个数组里
  let ast = css.parse(text);
  console.log(...ast.stylesheet.rules)
  rules.push(...ast.stylesheet.rules);
};

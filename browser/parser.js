// 通过自定义状态机解析html和css，进而了解浏览器解析原理
const ruleAction = require("./addCSSRule");
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

let stack = [{ type: "document", children: [] }];

let rules = [];

/**
 * 校验样式选择器
 * @param {element} element 
 * @param {选择器} selector 
 */
const match = (element, selector) => {
  if (!selector || !element.attributes) return false;
  // 如果是#开头的时候
  if (selector.charAt(0) == "#") {
    var attr = element.attributes.filter((attr) => attr.name === "id")[0];
    if (attr && attr.value == selector.replace("#", "")) return true;
  // 如果是.开头的代表class样式
  } else if (selector.charAt(0) == ".") {
    var attr = element.attributes.filter((attr) => attr.name == "class")[0];
    if (attr && attr.value == selector.replace(".", "")) return true;
  } else {
  // 其他就看tagName是否匹配
    if (element.tagName == selector) {
      return true;
    }
  }
};

const computeCss = (element) => {
  console.log(rules);
  // 获取父元素序列
  /**
   * 1、在computeCss函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
   * 2 、因为我们首先获取的是“当前元素”, 所以获得和计算父元素匹配的顺序是从内向外
   */
  // 从当前元素往父找
  var elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (let rule of rules) {
    var selectorParts = rule.selectors[0].split(" ").reverse();
    if (!match(element, selectorParts[0])) continue;

    let matched = false;
    var j = 1;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      // 如果匹配到了，就要加入
      console.log("Element", element, "matched rule", rule);
    }
  }
  console.log("compute Css  for element", element);
};

function emit(token) {
  let top = stack[stack.length - 1];
  if (token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;
    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({ name: p, value: token[p] });
      }
    }
    // 当tagName和属性就加好之后就开始compute css计算，尽可能的早
    computeCss(element);
    top.children.push(element);
    element.parent = top;
    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type == "endTag") {
    if (top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match!");
    } else {
      // --------------- 遇到style标签的时候，添加css规则的操作-----
      if (top.tagName == "style") {
        ruleAction.addCSSRules(top.children[0].content, rules);
      }
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type == "text") {
    if (currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}
const EOF = Symbol("EOF");

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c == EOF) {
    emit({ type: "EOF" });
    return;
  } else {
    emit({ type: "text", content: c });
    return data;
  }
}
function tagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c === "/") {
    return endTagOpen;
  } else {
    emit({ type: "text", content: c });
    return;
  }
}
function tagName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c.match(/^[/A-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else if (c == ">") {
    emit(currentToken);
    return data;
  } else {
    currentToken.tagName += c;
    return tagName;
  }
}
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c === ">") {
    // return tagOpen;
  } else if (c == EOF) {
  } else {
  }
}

function beforeAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == ">" || c == "/" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    // return beforeAttributeName;
  } else {
    currentAttribute = { name: "", value: "" };
    return attributeName(c);
  }
}
function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return beforeAttributeValue;
  } else if (c == '"') {
    return doubleQuotedAttributeValue;
  } else if (c == "'") {
    return singleQuotedAttributeValue;
  } else if (c == ">") {
  } else {
    return UnquotedAttributeValue(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if (c == '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if (c == "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == EOF) {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingStartTag;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<" || c == "=" || c == "`") {
  } else if (c == EOF) {
  } else {
    currentAttribute.value += c;
    return UnquotedAttributeValue;
  }
}

function selfClosingStartTag(c) {
  if (c == ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c == "EOF") {
  } else {
  }
}

function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c == "/") {
    return selfClosingStartTag;
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == EOF) {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

module.exports.parseHTML = (html) => {
  let state = data;
  for (const c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0];
};

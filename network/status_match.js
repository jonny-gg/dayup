// 模拟状态机
// 匹配 abababx
function match(string) {
  let state = start;
  for (const c of string) {
    console.log(c);
    state = state(c);
  }
  return state === end;
}

function start(c) {
  if (c === "a") {
    return foundA;
  } else {
    return start;
  }
}

function end(c) {
  return end;
}
function foundA(c) {
  if (c === "b") {
    return foundB;
  } else {
    return start(c);
  }
}

function foundB(c) {
  if (c === "x") {
    return end;
  } else {
    return foundA(c);
  }
}
function foundC(c) {
  if (c === "a") {
    return foundA1;
  } else {
    return start(c);
  }
}

function foundA1(c) {
  if (c === "b") {
    return foundB2;
  } else {
    return start(c);
  }
}

function foundB2(c) {
  if (c === "x") {
    return end;
  } else {
    return foundB(c);
  }
}

console.log(match("abababx"));

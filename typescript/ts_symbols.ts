let sym2 = Symbol("key");
let sym3 = Symbol("key");
sym2 === sym3; // false 因为symbol唯一
/**
 * 各种symbol api
 * https://typescript.bootcss.com/symbols.html
 */

// for..of vs for..in
let list = [
  { name: "jonny", age: 12 },
  { name: "qqq", age: 33 },
];
for (const i in list) {
  console.log(i);
}

for (const i of list) {
  console.log(i);
}
// 一个键一个值

/// <reference> node.d.ts
import * as URL from "url";
let myUrl = URL.parse("http://www.baidu.com", "127.0.0.1");

import x, { y } from "hot-new-module";
// x(y)

import aaa from './xyz.txt!text'
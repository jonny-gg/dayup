var set = new Set();

// 看看这些对象有哪些对象还是被同时创建的
// 统计下他们的路径

var globalProperties = [
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "Array",
  "Date",
  "RegExp",
  "Promise",
  "Proxy",
  "Map",
  "WeakMap",
  "Set",
  "WeakSet",
  "Function",
  "Boolean",
  "String",
  "Number",
  "Symbol",
  "Object",
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
  "ArrayBuffer",
  "SharedArrayBuffer",
  "DataView",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Int16Array",
  "Int32Array",
  "Uint8Array",
  "Uint16Array",
  "Uint32Array",
  "Uint8ClampedArray",
  "Atomics",
  "JSON",
  "Math",
  "Reflect",
];

let current;

var queue = [];

for (const p of globalProperties) {
  queue.push({
    path: [p],
    object: this[p],
  });
  //  console.log(this,p,this[p])
}

while (queue.length) {
  current = queue.shift();
  if (set.has(current.object)) continue;
  console.log(current.path.join("."));
  set.add(current.object);
  // console.log(current.object,"current");
  var proto = Object.getPrototypeOf(current.object);

  if (proto) {
    queue.push({
      path: current.path.concat(["__proto__"]),
      object: proto,
    });
  }
  for (let p of Object.getOwnPropertyNames(current.object)) {
    var property = Object.getOwnPropertyDescriptor(current.object, p);

    if (
      property.hasOwnProperty("value") &&
      ((property.value != null && typeof property.value == "object") ||
        typeof property.value == "object") &&
      property.value instanceof Object
    ) {
      queue.push({
        path: current.path.concat([p]),
        object: property.value,
      });
    }
    if (property.hasOwnProperty("get") && typeof property.get == "function") {
      debugger;
      queue.push({
        path: current.path.concat([p]),
        object: property.get,
      });
    }
    if (property.hasOwnProperty("set") && typeof property.set == "function") {
      // debugger;
      queue.push({
        path: current.path.concat([p]),
        object: property.set,
      });
    }
  }
}

class C {
  constructor() {
    /** @type {number | undefined} */
    this.prop = undefined;
  }
}
let c = new C();
c.prop = 0;
c.prop = "string";

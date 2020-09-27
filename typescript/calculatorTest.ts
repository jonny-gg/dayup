// import { test, Calculator } from "./calculator";

// const cal = new Calculator();
// test(cal,"1+2*3/1=");  // 顺序执行不区分运算符优先级

import { test, Calculator } from "./programmerCalculator";

let c = new Calculator(2);
test(c, "001+010="); // prints 3
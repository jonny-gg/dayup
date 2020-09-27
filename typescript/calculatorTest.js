"use strict";
// import { test, Calculator } from "./calculator";
Object.defineProperty(exports, "__esModule", { value: true });
// const cal = new Calculator();
// test(cal,"1+2*3/1=");  // 顺序执行不区分运算符优先级
var ProgrammerCalculator_1 = require("./ProgrammerCalculator");
var c = new ProgrammerCalculator_1.Calculator(2);
ProgrammerCalculator_1.test(c, "001+010="); // prints 3

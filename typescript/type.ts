// 类型断言
// 尖括号
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// as语法
let someValue_as: any = "this is a string";
let strLength_as: number = (someValue_as as string).length;

// 添加字符串索引签名
interface SqureConfig {
  label?: string;
  width?: number;
  [propName: string]: any; // 添加字符串索引签名
}

function printLabel2(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj2 = { size: 10, label: "Size 10 Object" };
printLabel(myObj2);
// ---------------------------------------------------------- //

// 函数声明
type C = { a: string; b?: number };
function f({ a = "2123", b = 0 }: C): void {}

f({ a: "ss" });

//接口
interface LabelledValue {
  label?: string;
  width?: number;
  [propName: string]: any; // 添加字符串索引签名 string
  [index: number]: string;
  readonly x?: number;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
// ---------------------------------------------------------- //

//函数类型
interface SearchFun {
  (source: string, subString: string): Boolean;
}

let mySearch: SearchFun;
// 只要位置对就好，参数的变量名称可以不一样
mySearch = function (source: string, sub: string) {
  let result = source.search(sub);
  return result > -1;
};
// ---------------------------------------------------------- //

// 实现接口
// 类静态部分与实例部分的区别
interface ClockInterface {
  tick(): void;
}
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

function createClock(
  clock: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new clock(hour, minute);
}

class A_Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}

class B_Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("tick tock");
  }
}

let a = createClock(A_Clock, 12, 17);
let b = createClock(B_Clock, 7, 32);

// 继承接口
interface Shape {
  color: string;
}
interface Work {
  do(): void;
}
interface Square extends Shape, Work {
  width: number;
}
let square = <Square>{
  color: "333",
  width: 333,
  do: () => {
    console.log("do somethin");
  },
};

console.log(square);

// 混合类型
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}
function getCounter(): Counter {
  let counter = <Counter>function (start: number) {
    console.log(start, "入参");
  };
  counter.interval = 100;
  counter.reset = function () {
    console.log("reset");
  };
  return counter;
}

let c = getCounter();
c(100);
c.reset();

// 接口继承类
class Control {
  private state: any;
}

interface SelectControl extends Control {
  select(): void;
}

class ChildControl extends Control implements SelectControl {
  select = function () {};
}

class Child3Control extends Control {
  constructor() {
    super();
  }
}
// error
// class Child2Control implements SelectControl {
//   select = function () {};
// }

// 存储器
let password = "secret password";

class Employee {
  private _fullName: string;

  get fullName(): string {
    return this._fullName;
  }
  set fullName(newPass: string) {
    if (password && password == "secret password") {
      this._fullName = newPass;
    } else {
      new Error("password is bad");
    }
  }
}

let emp = new Employee();
emp.fullName = "new password";
if (emp.fullName) {
  console.log("it work");
}

// 抽象类
abstract class Department {
  constructor(name: string) {}
  printName(): void {
    console.log("printname");
  }
  abstract printMeeting(): void;
}

class ChildDepartment extends Department {
  constructor() {
    super("ChildDepartment");
  }
  printMeeting(): void {
    console.log("实现abstract方法");
  }
  printMeeting2(): void {
    console.log("print meeting2");
  }
}

let department: Department; // 允许创建一个对抽象类型的引用
// department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new ChildDepartment(); // 允许对一个抽象子类进行实例化和赋值

department.printMeeting();
department.printName();
// department.printMeeting2(); // 方法再抽象类中不存在

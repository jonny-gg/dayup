// 类型推论
interface Demo1 {
  a: number | string | Array<string>;
}

class ClassDemo implements Demo1 {
  a: string | number | string[];
}
const demo = new ClassDemo();
demo.a = ["123"];

// 类型兼容性

// 高级类型
// 交叉类型 交叉类型是将多个类型合并为一个类型
const extend = <T, U>(first: T, second: U): T & U => {
  let result = <T & U>{};
  for (let id in first) {
    (<any>result)[id] = (<any>first)[id];
  }

  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<any>result)[id] = (<any>second)[id];
    }
  }
  return result;
};
class Person {
  constructor(public name: string) {}
}
interface Loggable {
  log(): void;
}
class ConsoleLogger implements Loggable {
  log() {
    // ...
    console.log("log");
  }
}

let jim = extend(new Person("jim"), new ConsoleLogger());
console.log(jim.name);
console.log(jim.log);

// 联合类型
// 联合类型表示一个值可以是几种类型之一

const padLeft = (value: string, padding: string | number) => {};

padLeft("123", 12);
interface Bird {
  name: string;
  fly(): string;
}

interface Fish {
  name: string;
  swiw(): string;
}
const getSmallPet = (): Bird | Fish => {
  return;
};

let pet = getSmallPet();
const isFish = (pet: Fish | Bird): pet is Fish => {
  // return typeof pet !== "Fish"
  return (<Fish>pet).swiw !== undefined;
};
const isBird = (pet: Fish | Bird): pet is Bird => {
  // return typeof pet !== "Fish"
  return (<Bird>pet).fly !== undefined;
};
// (<Bird>pet).fly(); // 类型断言
// pet.name;

// 用户自定义的类型保护
//(<Bird>pet).fly(); // 类型区分

if (isFish(pet)) {
  pet.swiw();
} else {
  pet.fly();
}

// typeof 类型保护
/**
 * 这些typeof类型保护只有两种形式能被识别：typeof v === "typename"和typeof v !== "typename"
 * "typename"必须是"number"，"string"，"boolean"或"symbol"
 *  */
const isNumber = (x: any): x is number => typeof x === "number";
// instanceof 类型保护
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}
const getRandomPadder = () =>
  Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder("  ");

let pad: Padder = getRandomPadder();
if (pad instanceof SpaceRepeatingPadder) {
  console.log(pad.getPaddingString());
}
if (pad instanceof StringPadder) {
  console.log(pad.getPaddingString());
}
/**
 * 如果编译器不能够去除null或undefined，你可以使用类型断言手动去除。 语法是添加!后缀：identifier!从identifier的类型里去除了null和undefined：
 */
function fixed(name: string | null | undefined): string {
  function postfix(epithet: string) {
    // 这里使用 ! 排除null 和undefined的影响
    return name!.charAt(0) + ".  the " + epithet; // ok
  }
  name = name || "Bob";
  return postfix("great");
}

// 类型别名
// 泛型 添加类型参数并且在别名声明的右侧传入
type Container<T> = { value: T };

// 与交叉类型一起使用
type LinkList<T> = T & { next: LinkList<T> };
interface Person {
  name: string;
}
var people: LinkList<Person>;
var s = people.name;
var s = people.next.name;
var s = people.next.next.name;

// 接口 vs. 类型别名
type Alias = { num: number };
interface Interface {
  num: number;
}
// 1、接口创建了一个新的名字，可以在其它任何地方使用。 类型别名并不创建新名字
declare function aliased(arg: Alias): Alias;
declare function interfaced(arg: Interface): Interface;
// 2、不能被extends和implements ，自己也不能extends和implements其它类型
// 3、如果你无法通过接口来描述一个类型并且需要使用联合类型或元组类型，这时通常会使用类型别名

type Easing = "ease-in" | "ease-out" | "ease-in-out";

// never 类型
// assertNever检查x是否为never类型—即为除去所有可能情况后剩下的类型
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

// 索引类型
const pluck = <T, K extends keyof T>(o: T, names: K[]): T[K][] =>
  names.map((n) => o[n]);

interface Person {
  name: string;
  age: number;
  sex?: Boolean;
}
let person: Person = { name: "jonny", age: 30 };
let strings: string[] | number[] = pluck(person, ["age"]);

// 隐射类型
type Readonly2<T> = {
  readonly [P in keyof T]: T[P];
};
type Partial2<T> = {
  [P in keyof T]?: T[P];
};
type PersonPartial = Partial2<Person>;
type PersonReadonly = Readonly2<Person>;
let par:PersonPartial
par.age = 123
// let read: PersonReadonly
// read.age =123

var ClassDemo = /** @class */ (function () {
    function ClassDemo() {
    }
    return ClassDemo;
}());
var demo = new ClassDemo();
demo.a = ["123"];
// 类型兼容性
// 高级类型
// 交叉类型 交叉类型是将多个类型合并为一个类型
var extend = function (first, second) {
    var result = {};
    for (var id in first) {
        result[id] = first[id];
    }
    for (var id in second) {
        if (!result.hasOwnProperty(id)) {
            result[id] = second[id];
        }
    }
    return result;
};
var Person = /** @class */ (function () {
    function Person(name) {
        this.name = name;
    }
    return Person;
}());
var ConsoleLogger = /** @class */ (function () {
    function ConsoleLogger() {
    }
    ConsoleLogger.prototype.log = function () {
        // ...
        console.log("log");
    };
    return ConsoleLogger;
}());
var jim = extend(new Person("jim"), new ConsoleLogger());
console.log(jim.name);
console.log(jim.log);
// 联合类型
// 联合类型表示一个值可以是几种类型之一
var padLeft = function (value, padding) { };
padLeft("123", 12);
var getSmallPet = function () {
    return;
};
var pet = getSmallPet();
var isFish = function (pet) {
    // return typeof pet !== "Fish"
    return pet.swiw !== undefined;
};
var isBird = function (pet) {
    // return typeof pet !== "Fish"
    return pet.fly !== undefined;
};
// (<Bird>pet).fly(); // 类型断言
// pet.name;
// 用户自定义的类型保护
//(<Bird>pet).fly(); // 类型区分
if (isFish(pet)) {
    pet.swiw();
}
else {
    pet.fly();
}
// typeof 类型保护
/**
 * 这些typeof类型保护只有两种形式能被识别：typeof v === "typename"和typeof v !== "typename"
 * "typename"必须是"number"，"string"，"boolean"或"symbol"
 *  */
var isNumber = function (x) { return typeof x === "number"; };
var SpaceRepeatingPadder = /** @class */ (function () {
    function SpaceRepeatingPadder(numSpaces) {
        this.numSpaces = numSpaces;
    }
    SpaceRepeatingPadder.prototype.getPaddingString = function () {
        return Array(this.numSpaces + 1).join(" ");
    };
    return SpaceRepeatingPadder;
}());
var StringPadder = /** @class */ (function () {
    function StringPadder(value) {
        this.value = value;
    }
    StringPadder.prototype.getPaddingString = function () {
        return this.value;
    };
    return StringPadder;
}());
var getRandomPadder = function () {
    return Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder("  ");
};
var pad = getRandomPadder();
if (pad instanceof SpaceRepeatingPadder) {
    console.log(pad.getPaddingString());
}
if (pad instanceof StringPadder) {
    console.log(pad.getPaddingString());
}

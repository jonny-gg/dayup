var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// 类型断言
// 尖括号
var someValue = "this is a string";
var strLength = someValue.length;
// as语法
var someValue_as = "this is a string";
var strLength_as = someValue_as.length;
function printLabel2(labelledObj) {
    console.log(labelledObj.label);
}
var myObj2 = { size: 10, label: "Size 10 Object" };
printLabel(myObj2);
function f(_a) {
    var _b = _a.a, a = _b === void 0 ? "2123" : _b, _c = _a.b, b = _c === void 0 ? 0 : _c;
}
f({ a: "ss" });
function printLabel(labelledObj) {
    console.log(labelledObj.label);
}
var myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
var mySearch;
// 只要位置对就好，参数的变量名称可以不一样
mySearch = function (source, sub) {
    var result = source.search(sub);
    return result > -1;
};
function createClock(clock, hour, minute) {
    return new clock(hour, minute);
}
var A_Clock = /** @class */ (function () {
    function A_Clock(h, m) {
    }
    A_Clock.prototype.tick = function () {
        console.log("beep beep");
    };
    return A_Clock;
}());
var B_Clock = /** @class */ (function () {
    function B_Clock(h, m) {
    }
    B_Clock.prototype.tick = function () {
        console.log("tick tock");
    };
    return B_Clock;
}());
var a = createClock(A_Clock, 12, 17);
var b = createClock(B_Clock, 7, 32);
var square = {
    color: "333",
    width: 333,
    do: function () {
        console.log("do somethin");
    },
};
console.log(square);
function getCounter() {
    var counter = function (start) {
        console.log(start, "入参");
    };
    counter.interval = 100;
    counter.reset = function () {
        console.log("reset");
    };
    return counter;
}
var c = getCounter();
c(100);
c.reset();
// 接口继承类
var Control = /** @class */ (function () {
    function Control() {
    }
    return Control;
}());
var ChildControl = /** @class */ (function (_super) {
    __extends(ChildControl, _super);
    function ChildControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.select = function () { };
        return _this;
    }
    return ChildControl;
}(Control));
var Child3Control = /** @class */ (function (_super) {
    __extends(Child3Control, _super);
    function Child3Control() {
        return _super.call(this) || this;
    }
    return Child3Control;
}(Control));
// error
// class Child2Control implements SelectControl {
//   select = function () {};
// }
// 存储器
var password = "secret password";
var Employee = /** @class */ (function () {
    function Employee() {
    }
    Object.defineProperty(Employee.prototype, "fullName", {
        get: function () {
            return this._fullName;
        },
        set: function (newPass) {
            if (password && password == "secret password") {
                this._fullName = newPass;
            }
            else {
                new Error("password is bad");
            }
        },
        enumerable: false,
        configurable: true
    });
    return Employee;
}());
var emp = new Employee();
emp.fullName = "new password";
if (emp.fullName) {
    console.log("it work");
}
// 抽象类
var Department = /** @class */ (function () {
    function Department(name) {
    }
    Department.prototype.printName = function () {
        console.log("printname");
    };
    return Department;
}());
var ChildDepartment = /** @class */ (function (_super) {
    __extends(ChildDepartment, _super);
    function ChildDepartment() {
        return _super.call(this, "ChildDepartment") || this;
    }
    ChildDepartment.prototype.printMeeting = function () {
        console.log("实现abstract方法");
    };
    ChildDepartment.prototype.printMeeting2 = function () {
        console.log("print meeting2");
    };
    return ChildDepartment;
}(Department));
var department; // 允许创建一个对抽象类型的引用
// department = new Department(); // 错误: 不能创建一个抽象类的实例
department = new ChildDepartment(); // 允许对一个抽象子类进行实例化和赋值
department.printMeeting();
department.printName();
// department.printMeeting2(); // 方法再抽象类中不存在
// 类型推断 -- 上下文归类
var myAdd = function (x, y) {
    return x + y;
};
var employeeName = function (first) {
    var last = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        last[_i - 1] = arguments[_i];
    }
    return first + "" + last.join("");
};
console.log(employeeName("123"));
var uiElement = /** @class */ (function () {
    function uiElement() {
    }
    uiElement.prototype.addClickListener = function (onclick) {
        throw new Error("Method not implemented.");
    };
    return uiElement;
}());
var Handler = /** @class */ (function () {
    function Handler() {
    }
    Handler.prototype.onClickBad = function (e) {
        this.info = e.message;
    };
    return Handler;
}());
var h = new Handler();
var ui = new uiElement();
// ui.addClickListener(h.onClickBad(new ErrorEvent("123"));
// 泛型
function loggingIdentity(arg) {
    console.log(arg.length);
    return arg;
}
var myLoggingIdentity = loggingIdentity;
// 泛型类
var GenericNumber = /** @class */ (function () {
    function GenericNumber() {
    }
    return GenericNumber;
}());
var gnum = new GenericNumber();
gnum.zero = "2";
gnum.add = function (x, y) {
    return x + y;
};
console.log(gnum.zero, gnum.add("2", "3"));
// 泛型约束
var getProperty = function (obj, key) { return obj[key]; };
var x = { a: 1, b: 2, c: 3, d: 4 };
getProperty(x, "a");
// getProperty(x, "m"); // 没有m属性，typescript类型检查报错
// 在泛型里使用类类型
var BeeKeeper = /** @class */ (function () {
    function BeeKeeper() {
    }
    return BeeKeeper;
}());
var ZooKeeper = /** @class */ (function () {
    function ZooKeeper() {
    }
    return ZooKeeper;
}());
var Animal = /** @class */ (function () {
    function Animal() {
    }
    return Animal;
}());
var Bee = /** @class */ (function (_super) {
    __extends(Bee, _super);
    function Bee() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Bee;
}(Animal));
var Lion = /** @class */ (function (_super) {
    __extends(Lion, _super);
    function Lion() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Lion;
}(Animal));
var createInstance = function (c) { return new c(); };
// createInstance(Lion).keeper.nametag;
// 枚举
var FileAccess;
(function (FileAccess) {
    FileAccess[FileAccess["None"] = 0] = "None";
    FileAccess[FileAccess["Read"] = 2] = "Read";
    FileAccess[FileAccess["Write"] = 16] = "Write";
    FileAccess[FileAccess["ReadWrite"] = 18] = "ReadWrite";
    FileAccess[FileAccess["G"] = "123".length] = "G";
})(FileAccess || (FileAccess = {}));
console.log(FileAccess.Read);
console.log(FileAccess.Write);

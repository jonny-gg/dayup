"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.Calculator = void 0;
var Calculator = /** @class */ (function () {
    function Calculator() {
        this.current = 0;
        this.memory = 0;
    }
    Calculator.prototype.processDigit = function (digit, currentValue) {
        if (digit >= "0" && digit <= "9") {
            console.log(currentValue * 10 + (digit.charCodeAt(0) - "0".charCodeAt(0)));
            return currentValue * 10 + (digit.charCodeAt(0) - "0".charCodeAt(0));
        }
    };
    Calculator.prototype.processOperator = function (operator) {
        if (["+", "-", "*", "/"].indexOf(operator) >= 0)
            return operator;
    };
    Calculator.prototype.evaluateOperator = function (operator, left, right) {
        switch (this.operator) {
            case "+":
                return left + right;
            case "-":
                return left - right;
            case "*":
                return left * right;
            case "/":
                return left / right;
        }
    };
    Calculator.prototype.evaluate = function () {
        if (this.operator) {
            this.memory = this.evaluateOperator(this.operator, this.memory, this.current);
        }
        else {
            this.memory = this.current;
        }
        this.current = 0;
    };
    Calculator.prototype.handleChar = function (char) {
        if (char === "=") {
            this.evaluate();
            return;
        }
        else {
            var value = this.processDigit(char, this.current);
            if (value) {
                this.current = value;
                return;
            }
            else {
                var value_1 = this.processOperator(char);
                if (value_1) {
                    this.evaluate();
                    this.operator = value_1;
                    return;
                }
            }
        }
        throw new Error("Unsupported input: '" + char + "'");
    };
    Calculator.prototype.getResult = function () {
        return this.memory;
    };
    return Calculator;
}());
exports.Calculator = Calculator;
exports.test = function (c, input) {
    for (var i = 0; i < input.length; i++) {
        c.handleChar(input[i]);
    }
    console.log("result of '" + input + "' is '" + c.getResult() + "'");
};

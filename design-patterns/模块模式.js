// 模块设计模式
function CustomType() {
  this.name = "guoquanning"
};

CustomType.prototype.getName = function () {
  return this.name
}

var application = (function () {
  var privateA = "aa";
  function A(){}

  var object = new CustomType();

  object.A = "bb"

  object.B = function (){
    return privateA
  }

  return object;
})()

console.log(application);
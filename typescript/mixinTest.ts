// Disposable Mixin
class Disposable {
  isDisposed: boolean;
  dispose() {
    this.isDisposed = true;
  }
}

// Activatable Mixin
class Activatable {
  isActive: boolean;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}

class SmartObject implements Disposable, Activatable {
  constructor() {
    setInterval(
      () => console.log(this.isActive + " : " + this.isDisposed),
      500
    );
  }

  interact() {
    this.activate();
  }

  // Disposable
  isDisposed: boolean = false;
  dispose: () => void;
  // Activatable
  isActive: boolean = false;
  activate: () => void;
  deactivate: () => void;
}
applyMixins(SmartObject, [Disposable, Activatable]);
let smartObj = new SmartObject();
setTimeout(() => {
  smartObj.interact();
}, 1000);

// 它会遍历mixins上的所有属性，并复制到目标上去，把之前的占位属性替换成真正的实现代码
function applyMixins(derivedCtor: any, baseCtros: any[]) {
  baseCtros.forEach((baseCtro) => {
    Object.getOwnPropertyNames(baseCtro.prototype).forEach((name) => {
      derivedCtor.prototype[name] = baseCtro.prototype[name];
    });
  });
}

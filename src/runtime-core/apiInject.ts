import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // cun
  //   存到当前component里面
  const currentInstance: any = getCurrentInstance();

  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent.provides;
    // 当前provides的原型指向了他的父级
    // Object.create创建有原型的对象，将这个对象的原型指向parentProvides
    // 简单来说就是集成了parentProvides的所有属性，但是修改对象不会影响父亲的

    // init
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }

    provides[key] = value;
  }
}

export function inject(key, defaultValue) {
  // qu
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    const parentProvides = currentInstance.parent.provides;
    if (key in parentProvides) {
      return parentProvides[key];
    } else if (defaultValue) {
      if (typeof defaultValue === "function") {
        return defaultValue();
      } else {
        return defaultValue;
      }
    }
  }
}

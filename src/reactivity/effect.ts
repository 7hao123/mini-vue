class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}

const targetMap = new Map();
// targetMap 存储了所有的响应式对象依赖
// 然后通过target来拿到对应的depsMap(某个对象的依赖)
export function track(target, key) {
  // target -> key -> dep

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  //   接下来进行依赖的收集   但是我们拿不到fn，所以创建一个全局变量
  dep.add(activeEffect);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    effect.run();
  }
}

// 这个也就是全局变量
let activeEffect;
// 收集依赖收集的就是ReactiveEffect类的实例也就是收集的fn
export function effect(fn) {
  // 调用fn   封装一个类，执行run方法
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  console.log("targetMap", targetMap);
  return _effect.run.bind(_effect);
}

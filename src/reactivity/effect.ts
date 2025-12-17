import { extend } from "../shared";
class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    // 1.执行fn会收集依赖
    //  shouldTrack来进行区分
    if (!this.active) {
      return this._fn();
    }
    shouldTrack = true;
    activeEffect = this;

    const result = this._fn();
    // reset
    shouldTrack = false;
    return result;
  }
  stop() {
    if (this.active) {
      // 去除dep里面的当前effect
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
  effect.deps.length = 0;
}

const targetMap = new Map();
// targetMap 存储了所有的响应式对象依赖
// 然后通过target来拿到对应的depsMap(某个对象的依赖)
export function track(target, key) {
  // target -> key -> dep
  if (!isTracking()) return;
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
  if (dep.has(activeEffect)) return;
  //   接下来进行依赖的收集   但是我们拿不到fn，所以创建一个全局变量
  dep.add(activeEffect);
  // 为了让stop知道当前effect在哪dep里面
  activeEffect.deps.push(dep);
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

// 这个也就是全局变量
let activeEffect;
let shouldTrack = false;
// 收集依赖收集的就是ReactiveEffect类的实例也就是收集的fn
export function effect(fn, options?: any) {
  // 调用fn   封装一个类，执行run方法
  const _effect = new ReactiveEffect(fn, options?.scheduler);
  // _effect.onStop = options?.onStop;
  //options 通过浅拷贝更优雅
  Object.assign(_effect, options);
  // extend
  extend(_effect, options);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}

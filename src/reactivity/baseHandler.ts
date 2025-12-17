import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";
// 只需要创建一个createGetter
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
// reactive和readonly的实现很相似，进行抽象
function createGetter(isReadonly = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    // TODO 触发依赖
    trigger(target, key);

    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(
      `key:"${String(key)}" set 失败，因为 target 是 readonly 类型`,
      target
    );
    return true;
  },
};

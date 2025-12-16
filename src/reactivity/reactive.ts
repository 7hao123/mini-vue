import { track, trigger } from "./effect";
export function reactive(raw) {
  return new Proxy(raw, {
    // target是当前对象{foo:1}，key是用户访问的foo
    get(target, key) {
      const res = Reflect.get(target, key);
      // TODO 依赖收集
      track(target, key);
      return res;
    },

    set(target, key, value) {
      const res = Reflect.set(target, key, value);

      // TODO 触发依赖
      trigger(target, key);
      return res;
    },
  });
}

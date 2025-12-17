import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandler";
export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export const enum ReactiveFlags {
  IS_REACTIVE = "is_reactive",
  IS_READONLY = "is_readonly",
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}

export function isReactive(value) {
  // 这里会触发get
  // 需要转换成boolean类型,因为如果不是响应式对象会undefined
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function shallowReadonly(value) {
  return createActiveObject(value, shallowReadonlyHandlers);
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}

function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

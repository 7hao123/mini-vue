import { hasChanged, isObject } from "../shared";
import { trackEffects, isTracking, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _rawValue;
  public dep;
  constructor(value) {
    // 判断是否是对象，如果是对象的话，需要转成响应式
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  //   这里的get访问器，调用的时候不用（）
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    // 先修改value的值，再去track
    // Object.is是为了弥补===的缺陷，一个是nan，一个是+0/-0
    // 这里比较的时候 是一个proxy和一个原始值的比较
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffects(this.dep);
    } else {
      return;
    }
  }
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep);
  }
}

export function ref(value) {
  // 一个对象，里面有一个value属性
  return new RefImpl(value);
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

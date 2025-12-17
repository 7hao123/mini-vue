import { hasChanged, isObject } from "../shared";
import { trackEffects, isTracking, triggerEffects } from "./effect";
import { reactive } from "./reactive";

// ref接收的是是值
// 由于proxy只能接收对象  proxy->object
// 所以用一个对象来包裹  里面有value  来写get 和set

class RefImpl {
  private _value;
  private _rawValue;
  public dep;
  public __v_isRef = true;
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

function convert(value) {
  return isObject(value) ? reactive(value) : value;
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

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      // get->age(ref) 给他返回。value
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}

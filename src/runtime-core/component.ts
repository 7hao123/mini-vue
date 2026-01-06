import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode, parent) {
  console.log("createComponentInstance", parent);
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    el: null,
    props: {},
    slots: {},
    provides: {},
    parent,
    emit: () => {},
  };

  // component.emit = emit as any;
  // 这里第一个参数是绑定this，第二个传入component
  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance) {
  // TODO
  initProps(instance, instance.vnode.props);
  // 把children赋值给slots
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

export function setupStatefulComponent(instance) {
  // TODO
  const Component = instance.type;
  // 这个空对象是ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);

  const { setup } = Component;
  if (setup) {
    setCurrentInstance(instance);
    // 可能返回function或者object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    // 清空？？？
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}

function finishComponentSetup(instance) {
  const Component = instance.type;
  // if (Component.render) {
  instance.render = Component.render;
  // }
}
let currentInstance = null;

export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance) {
  // 可以方便跟踪
  currentInstance = instance;
}

import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  // TODO  判断vnode是不是一个element
  // 是element那应该处理element
  processElement(vnode, container);
  processComponent(vnode, container);
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render();
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container);
}

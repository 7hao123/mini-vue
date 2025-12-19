import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {
  // 判断vnode是element还是component来进行不同的处理
  // TODO  判断vnode是不是一个element
  // 是element那应该处理element
  if (typeof vnode.type === "string") {
    processElement(vnode, container);
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container);
  }
}

function processElement(vnode, container) {
  mountElement(vnode, container);
}

function mountElement(vnode, container) {
  // 创建一个element全过程
  // const el = document.createElement("div");
  // el.textContent = "hi mini-vue";
  // el.setAttribute("id", "root");
  // document.body.appendChild(el);
  const el = (vnode.el = document.createElement(vnode.type));
  // stinrg array
  const { children } = vnode;
  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }

  const { props } = vnode;
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }
  container.append(el);
}

function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}

function processComponent(vnode, container) {
  mountComponent(vnode, container);
}

function mountComponent(initialVnode, container) {
  const instance = createComponentInstance(initialVnode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}

function setupRenderEffect(instance, initialVnode, container) {
  const { proxy } = instance;
  // const subTree = instance.render();
  // 将proxy绑定到render上
  const subTree = instance.render.call(proxy);
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container);

  // 所有的element 都mount之后
  initialVnode.el = subTree.el;
}

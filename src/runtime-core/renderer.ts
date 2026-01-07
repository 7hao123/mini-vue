import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options;
  function render(vnode, container) {
    patch(vnode, container, null);
  }

  function patch(vnode, container, parentComponent) {
    // 判断vnode是element还是component来进行不同的处理
    // 判断vnode是不是一个element
    // 是element那应该处理element
    // if (typeof vnode.type === "string") {
    //   processElement(vnode, container);
    // } else if (isObject(vnode.type)) {
    //   processComponent(vnode, container);
    // }
    const { type, shapeFlag } = vnode;
    // Fragment只渲染children
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container, parentComponent);
        }
    }
  }
  function processText(vnode, container) {
    const { children } = vnode;
    const textNode = (vnode.el = document.createTextNode(children));
    container.appendChild(textNode);
  }

  // 这里我们要新增处理Fragment，只渲染children
  function processFragment(vnode, container, parentComponent) {
    mountChildren(vnode, container, parentComponent);
  }

  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
  }

  function mountElement(vnode, container, parentComponent) {
    // 创建一个element全过程
    // const el = document.createElement("div");
    // el.textContent = "hi mini-vue";
    // el.setAttribute("id", "root");
    // document.body.appendChild(el);
    const el = (vnode.el = createElement(vnode.type));
    // stinrg array
    const { children, shapeFlag } = vnode;
    // if (typeof children === "string") {
    //   el.textContent = children;
    // } else if (Array.isArray(children)) {
    //   mountChildren(vnode, el);
    // }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }

    const { props } = vnode;
    for (const key in props) {
      const val = props[key];

      // const isOn = (key: string) => /^on[A-Z]/.test(key);
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase();
      //   el.addEventListener(event, val);
      // }
      // // 具体的click，需要抽离成通用的
      // // if (key === "onClick") {
      // //   el.addEventListener("click", val);
      // // }
      // el.setAttribute(key, val);
      patchProp(el, key, val);
      console.log(key);
    }
    // container.append(el);
    insert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(v, container, parentComponent);
    });
  }

  function processComponent(vnode, container, parentComponent) {
    mountComponent(vnode, container, parentComponent);
  }

  function mountComponent(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
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
    patch(subTree, container, instance);

    // 所有的element 都mount之后
    initialVnode.el = subTree.el;
  }

  return {
    createApp: createAppApi(render),
  };
}

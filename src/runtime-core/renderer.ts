import { effect } from "../reactivity/effect";
import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppApi } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRenderer(options) {
  const { createElement, patchProp: hostPatchProp, insert } = options;
  function render(vnode, container) {
    patch(null, vnode, container, null);
  }

  // n1: oldVnode, n2: newVnode
  function patch(n1, n2, container, parentComponent) {
    // 判断vnode是element还是component来进行不同的处理
    // 判断vnode是不是一个element
    // 是element那应该处理element
    // if (typeof vnode.type === "string") {
    //   processElement(vnode, container);
    // } else if (isObject(vnode.type)) {
    //   processComponent(vnode, container);
    // }
    const { type, shapeFlag } = n2;
    // Fragment只渲染children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent);
        }
    }
  }
  function processText(n1, n2, container) {
    const { children } = n2;
    const textNode = (n2.el = document.createTextNode(children));
    container.appendChild(textNode);
  }

  // 这里我们要新增处理Fragment，只渲染children
  function processFragment(n1, n2, container, parentComponent) {
    mountChildren(n2, container, parentComponent);
  }

  function processElement(n1, n2, container, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }
  const EMPTY_OBJ = {};
  function patchElement(n1, n2, container) {
    console.log("patchElement");
    console.log("n1", n1);
    console.log("n2", n2);
    // 更新element,先更新props
    // 1,foo之前的值和现在的值不一样了（修改）foo->foo-new
    // 2.之前的值现在变成了null||undefined（删除） foo->null
    // 3.bar这个属性在新的prop里面没有了  （删除）

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;

    const el = (n2.el = n1.el);

    patchProps(el, oldProps, newProps);
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];
        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
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
      hostPatchProp(el, key, null, val);
    }
    // container.append(el);
    insert(el, container);
  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.forEach((v) => {
      patch(null, v, container, parentComponent);
    });
  }

  function processComponent(n1, n2, container, parentComponent) {
    mountComponent(n2, container, parentComponent);
  }

  function mountComponent(initialVnode, container, parentComponent) {
    const instance = createComponentInstance(initialVnode, parentComponent);
    setupComponent(instance);
    setupRenderEffect(instance, initialVnode, container);
  }

  function setupRenderEffect(instance, initialVnode, container) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        const { proxy } = instance;
        // const subTree = instance.render();
        // 将proxy绑定到render上
        const subTree = (instance.subTree = instance.render.call(proxy));
        console.log(subTree);
        // vnode -> patch
        // vnode -> element -> mountElement
        // 如果是patch的话会出现三个节点，因为每次都会重新挂在
        patch(null, subTree, container, instance);

        // 所有的element 都mount之后
        initialVnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const { proxy } = instance;
        const subTree = instance.render.call(proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;

        console.log("current", subTree);
        console.log("prev", prevSubTree);
        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  return {
    createApp: createAppApi(render),
  };
}

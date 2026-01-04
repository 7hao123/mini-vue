import { createVNode, Fragment } from "../vnode";

export function renderSlots(slots, name, props) {
  // 有了作用域插槽之后，slot可能是function了
  const slot = slots[name];
  if (slot) {
    if (typeof slot === "function") {
      // 这里包裹了一个div，不方便
      return createVNode(Fragment, {}, slot(props));
    }
  }
}

import { createVNode } from "./vnode";

export function createAppApi(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // 先创建一个vnode
        // 所有的逻辑操作都会基于vnode做处理
        //   mount里面传的根组件，我们需要component-> vnode
        const vnode = createVNode(rootComponent);
        render(vnode, rootContainer);
      },
    };
  };
}

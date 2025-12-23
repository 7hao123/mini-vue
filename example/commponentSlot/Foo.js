import { h, renderSlots } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  setup() {
    return {};
  },
  render() {
    const foo = h("p", {}, "foo");
    console.log(this.$slots);
    // 返回Foo 的vnode的children
    // renderSlots 1,获取到要渲染的元素 2.获取到要渲染的位置
    // return h("div", {}, [foo, renderSlots(this.$slots)]);
    // 具名插槽
    // return h("div", {}, [
    //   renderSlots(this.$slots, "header"),
    //   foo,
    //   renderSlots(this.$slots, "footer"),
    // ]);
    //下面实现作用域插槽，将插槽内的变量传给父组件
    const age = 18;
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
};

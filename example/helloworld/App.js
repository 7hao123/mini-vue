import { h } from "../../lib/guide-mini-vue.esm.js";
window.self = null;
export const App = {
  // template需要有编译能力，所以目前先写render函数
  render() {
    window.self = this;
    // 返回一个虚拟节点
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
      },
      // 这里是string
      // 想要拿到代理对象，就要将setup的返回值绑定到render的this上
      // 除此之外还需要$el等其他属性
      // 所以采用proxy模式
      "hello" + this.msg
      // 这里是array
      // [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    );
  },
  setup() {
    return {
      msg: "mini-vue hh",
    };
  },
};

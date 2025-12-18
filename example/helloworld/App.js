import { h } from "../../lib/guide-mini-vue.esm.js";
export const App = {
  // template需要有编译能力，所以目前先写render函数
  render() {
    // 返回一个虚拟节点
    return h(
      "div",
      {
        id: "root",
        class: ["red", "hard"],
      },
      // 这里是string
      // "hello" + this.msg
      // 这里是array
      [h("p", { class: "red" }, "hi"), h("p", { class: "blue" }, "mini-vue")]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};

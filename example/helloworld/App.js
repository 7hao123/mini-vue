import { h } from "../../lib/guide-mini-vue.esm.js";
export const App = {
  // template需要有编译能力，所以目前先写render函数
  render() {
    // 返回一个虚拟节点
    return h("div", "hello" + this.msg);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};

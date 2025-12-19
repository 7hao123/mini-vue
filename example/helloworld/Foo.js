import { h } from "../../lib/guide-mini-vue.esm.js";

export const Foo = {
  setup(props) {
    // 1,打印出来props
    // 2.可以在render里面访问
    // 3.readonly
    console.log(props);
  },
  render() {
    return h("div", {}, "foo:" + this.count);
  },
};

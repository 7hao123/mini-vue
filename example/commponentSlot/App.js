import { h } from "../../lib/guide-mini-vue.esm.js";
import { Foo } from "./Foo.js";
export const App = {
  name: "App",
  render() {
    const app = h("div", {}, "app");
    // 这里用template显示的话就是
    // <Foo><p>123</p></Foo>
    // const foo = h(Foo, {}, [h("p", {}, "123"), h("p", {}, "456")]);
    const foo = h(
      Foo,
      {},
      // {
      //   // 这里是具名插槽？？
      //   header: h("p", {}, "header"),
      //   footer: h("p", {}, "456"),
      // }
      {
        // 这里是具名插槽？？
        header: (age) => h("p", {}, "header", age),
        footer: h("p", {}, "456"),
      }
    );
    return h("div", {}, [app, foo]);
  },
  setup() {
    return {};
  },
};

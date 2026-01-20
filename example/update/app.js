import { h, ref } from "../../lib/guide-mini-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
    };

    const props = ref({
      foo: "foo",
      bar: "bar",
    });

    // 情况1: 值改变 - foo 从 "foo" 变为 "new-foo"
    const onChangePropsDemo1 = () => {
      props.value.foo = "new-foo";
    };

    // 情况2: 值变为 undefined - foo 设为 undefined
    const onChangePropsDemo2 = () => {
      props.value.foo = undefined;
    };

    // 情况3: 属性删除 - 删除 bar 属性
    const onChangePropsDemo3 = () => {
      props.value = {
        foo: "foo",
        // bar 被删除了
      };
    };

    return {
      count,
      onClick,
      props,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3,
    };
  },
  render() {
    return h("div", { id: "root", ...this.props }, [
      h("div", {}, "count:" + this.count),
      h("button", { onClick: this.onClick }, "click"),
      h(
        "button",
        { onClick: this.onChangePropsDemo1 },
        "情况1: 值改变 (foo: foo -> new-foo)"
      ),
      h(
        "button",
        { onClick: this.onChangePropsDemo2 },
        "情况2: 值变为 undefined"
      ),
      h(
        "button",
        { onClick: this.onChangePropsDemo3 },
        "情况3: 删除 bar 属性"
      ),
    ]);
  },
};

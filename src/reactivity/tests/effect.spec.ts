import { reactive } from "../reactive";
import { effect } from "../effect";
describe("effect", () => {
  // reactivity core content
  // 执行effect的时候，会触发响应式对象get的时候会收集依赖，当触发set的时候会触发依赖
  it("happy patch", () => {
    const user = reactive({
      age: 10,
      name: "xiaoming",
    });

    let nextAge;
    let nextName;
    effect(() => {
      nextAge = user.age + 1;
      nextName = "hello " + user.name;
    });

    expect(nextAge).toBe(11);
    expect(nextName).toBe("hello xiaoming");
    // update
    user.age++;
    expect(nextAge).toBe(12);
  });
});

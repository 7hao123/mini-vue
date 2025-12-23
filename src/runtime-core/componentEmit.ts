import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance, event, ...args) {
  console.log("emit", event);

  const { props } = instance;

  //   TPP
  //   先去写一个特定的行为-> 重构成通用的
  //   add-> Add
  // add-foo ->addFoo
  //   const handler = props["onAdd"];
  //   handler && handler();

  const handler = props[toHandlerKey(camelize(event))];
  //   const handler = props[`on${capitalize(event)}`];
  handler && handler(...args);
}

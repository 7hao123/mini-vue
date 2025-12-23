export const extend = Object.assign;
export const isObject = (val) => {
  return val !== null && typeof val === "object";
};
export const hasChanged = (val, newValue) => !Object.is(val, newValue);

export const camelize = (str) =>
  str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const toHandlerKey = (str) => (str ? "on" + capitalize(str) : "");

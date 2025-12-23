import { ShapeFlags } from "../shared/ShapeFlags";

export function initSlots(instance, children) {
  // 只有是slots的children
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children, slots) {
  //   instance.slots = Array.isArray(children) ? children : [children];
  // 把他转成object

  for (const key in children) {
    const value = children[key];
    slots[key] = (props) => normalizeSlotValue(value(props));
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}

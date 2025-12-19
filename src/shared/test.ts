// export const ShapeFlags = {
//   element: 0,
//   stateful_componet: 0,
//   text_children: 0,
//   array_children: 0,
// };

// 1.可以设值
// ShapeFlags.stateful_component = 1

// 2.查找
// if(ShapeFlags.element)

// 不够高效 -> 位运算

// 0000 -> element
// 0010 -> stateful
// 0100 -> text_children
// 1000 -> array_children

// 通过或来赋值
// 通过与来查找

import { NodeTypes } from "./ast";

export function transform(root: any, options: any = {}) {
  const context = createTransformContext(root, options);
  // 1.  遍历 AST - 深搜    // 2.  修改text content
  traverseNode(root, context);

  //   root codegen node
  createRootCodegen(root);
}

function createRootCodegen(root: any) {
  root.codegenNode = root.children[0];
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
  };
  return context;
}

function traverseNode(node: any, context) {
  console.log("node", node);
  //   if (node.type === NodeTypes.TEXT) {
  //     node.content = node.content + " mini-vue";
  //   }
  const nodeTransforms = context.nodeTransforms;
  if (nodeTransforms) {
    for (let i = 0; i < nodeTransforms.length; i++) {
      const transform = nodeTransforms[i];
      transform(node);
    }
  }
  traverseChildren(node, context);
}

function traverseChildren(node: any, context) {
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traverseNode(node, context);
    }
  }
}

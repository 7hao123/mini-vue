import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}

function parseChildren(context: any) {
  const nodes: any = [];
  let node;
  const s = context.source;
  console.log("context.source", context.source);
  if (s.startsWith("{{")) {
    node = parseInterpolation(context);
  } else if (s[0] === "<") {
    // 解析元素
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context);
    }
  }
  if (!node) {
    node = parseText(context);
  }
  nodes.push(node);
  return nodes;
}

function parseElement(context: any) {
  // 1.解析tag
  // 2.删除解析过的代码
  const element: any = parseTag(context, TagType.Start);
  parseTag(context, TagType.End);
  console.log("element", element, "-----------", context.source);
  return element;
}

function parseTag(context: any, tagType: any) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceBy(context, 1);
  if (tagType === TagType.End) return;
  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}

function parseInterpolation(context: any) {
  // 获取 {{message}} 中的 message
  const openDelimiter = "{{";
  const closeDelimiter = "}}";
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length,
  );

  advanceBy(context, openDelimiter.length);

  const rawContentLength = closeIndex - openDelimiter.length;

  const rawContent = context.source.slice(0, rawContentLength);
  const content = rawContent.trim();

  advanceBy(context, rawContentLength + closeDelimiter.length);

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function advanceBy(context: any, length: number) {
  context.source = context.source.slice(length);
}

function createRoot(children: any) {
  return {
    children,
  };
}

function createParserContext(content: string) {
  return {
    source: content,
  };
}
function parseText(context: any): any {
  // 1.获取Content
  const content = context.source.slice(0, context.source.length);
  advanceBy(context, content.length);
  console.log("content", content, "-----------", context.source);
  // 2.推进
  return {
    type: NodeTypes.TEXT,
    content: content,
  };
}

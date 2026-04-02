import { NodeTypes } from "./ast";

const enum TagType {
  Start,
  End,
}

export function baseParse(content: string) {
  const context = createParserContext(content);
  return createRoot(parseChildren(context, []));
}

function parseChildren(context: any, ancestors) {
  const nodes: any = [];
  while (!isEnd(context, ancestors)) {
    let node;
    const s = context.source;
    console.log("context.source", context.source);
    if (s.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (s[0] === "<") {
      // 解析元素
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors);
      }
    }
    if (!node) {
      node = parseText(context);
    }
    nodes.push(node);
  }

  return nodes;
}

function isEnd(context: any, ancestors) {
  // 1.当遇到结束标签时，停止解析
  const s = context.source;
  if (s.startsWith("</")) {
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const tag = ancestors[i];
      if (startsWithEndTagOpen(s, tag)) {
        return true;
      }
    }
  }
  // 2.source有值的时候
  return !context.source;
}

function startsWithEndTagOpen(source: string, tag: string) {
  return source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase();
}

function parseElement(context: any, ancestors) {
  // 1.解析tag
  // 2.删除解析过的代码
  const element: any = parseTag(context, TagType.Start);
  ancestors.push(element.tag);
  element.children = parseChildren(context, ancestors);
  ancestors.pop();
  // 如果对不上的话，消费的标签不对

  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End);
  } else {
    throw new Error(`缺少结束标签:${element.tag}`);
  }
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
  let endTokens = ["<", "{{"];
  let endIndex = context.source.length;
  let endToken;
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    if (index !== -1 && index < endIndex) {
      endIndex = index;
      endToken = endTokens[i];
    }
  }

  const index = context.source.indexOf(endToken);
  if (index !== -1) {
    endIndex = index;
  }
  // 1.获取Content
  const content = context.source.slice(0, endIndex);
  advanceBy(context, content.length);
  console.log("content", content, "-----------", context.source);
  // 2.推进
  return {
    type: NodeTypes.TEXT,
    content: content,
  };
}

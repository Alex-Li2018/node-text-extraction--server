// 处理parent循环引用的问题
import { OpenXmlElement } from './document/dom';

export function formatParagraphText(data) {
  if (!data.children) return;

  (data.children as any[]).forEach(item => {
    let paragraphText = '';

    let queue: any[] = [ ...item.children ];


    while (queue.length !== 0) {
      const node: any = queue.shift();

      if (node.children && node.children.length > 0) {
        queue = queue.concat(node.children);
        if (node.parent) {
          node.parent = null;
        }
      } else {
        paragraphText += node.text;
      }
    }
    item.paragraph_text = paragraphText;
  });
}

export function formatParentWordData(data: OpenXmlElement) {
  let queue: any[] = [];
  formatParagraphText(data);

  queue.push(data);

  while (queue.length !== 0) {
    const node: any = queue.shift();
    if (node.children && node.children.length > 0) {
      queue = queue.concat(node.children);

      if (node.parent) {
        node.parent = null;
      }
    }
  }

  return {
    ...data,
  };
}

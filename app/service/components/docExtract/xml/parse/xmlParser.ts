import {
  Length,
  LengthUsage,
  LengthUsageType,
  convertLength,
  convertBoolean,
} from '../../document/common';

export function parseXmlString(xmlString: string, trimXmlDeclaration = false): Document {
  if (trimXmlDeclaration) { xmlString = xmlString.replace(/<[?].*[?]>/, ''); }

  const result = new DOMParser().parseFromString(xmlString, 'application/xml');
  const errorText = hasXmlParserError(result);

  if (errorText) { throw new Error(errorText); }

  return result;
}

function hasXmlParserError(doc: Document) {
  return doc.getElementsByTagName('parsererror')[0]?.textContent;
}

export function serializeXmlString(elem: Node): string {
  return new XMLSerializer().serializeToString(elem);
}

export class XmlParser {
  elements(elem: Element, localName = ''): Element[] {
    // 向数组里添加数据时，必须要先定义元素的类型
    const result: Array<any> = [];

    for (let i = 0, l = elem.childNodes.length; i < l; i++) {
      const c = elem.childNodes.item(i);
      // 找到元素节点
      if (c.nodeType === 1 && (localName == null || (c as Element).localName === localName)) {
        result.push(c);
      }
    }

    return result;
  }

  element(elem: Element, localName: string): Element | null {
    for (let i = 0, l = elem.childNodes.length; i < l; i++) {
      const c = elem.childNodes.item(i);

      if (c.nodeType === 1 && (c as Element).localName === localName) { return c as Element; }
    }

    return null;
  }

  elementAttr(elem: Element, localName: string, attrLocalName: string): string | undefined | null {
    const el = this.element(elem, localName);
    return el ? this.attr(el, attrLocalName) : undefined;
  }

  // 获取XML元素上的属性
  attr(elem: Element, localName: string): string | null {
    for (let i = 0, l = elem.attributes.length; i < l; i++) {
      const a = elem.attributes.item(i);

      if (a?.localName === localName) { return a.value; }
    }

    return null;
  }

  intAttr(node: Element, attrName: string, defaultValue = 0): number {
    const val = this.attr(node, attrName);
    return val ? parseInt(val) : defaultValue;
  }

  hexAttr(node: Element, attrName: string, defaultValue = 0): number {
    const val = this.attr(node, attrName);
    return val ? parseInt(val, 16) : defaultValue;
  }

  floatAttr(node: Element, attrName: string, defaultValue = 0): number {
    const val = this.attr(node, attrName);
    return val ? parseFloat(val) : defaultValue;
  }

  boolAttr(node: Element, attrName: string, defaultValue = false) {
    return this.attr(node, attrName) ? convertBoolean((this.attr(node, attrName)) as string, defaultValue) : null;
  }

  lengthAttr(node: Element, attrName: string, usage: LengthUsageType = LengthUsage.Dxa): Length {
    return this.attr(node, attrName) ? convertLength(this.attr(node, attrName) as string, usage) : null;
  }
}

const globalXmlParser = new XmlParser();

export default globalXmlParser;

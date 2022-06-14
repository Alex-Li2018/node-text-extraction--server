import {
  Length,
  LengthUsage,
  LengthUsageType,
  convertLength,
  convertBoolean,
} from '../document/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

export function parseXmlString(xmlString: string, trimXmlDeclaration = false): Document {
  if (trimXmlDeclaration) { xmlString = xmlString.replace(/<[?].*[?]>/, ''); }

  try {
    const result = new JSDOM(xmlString, {
      contentType: 'text/html',
    });
    const errorText = hasXmlParserError(result?.window?.document);

    if (errorText) { throw new Error(errorText); }

    return result?.window?.document;
  } catch (err) {
    throw new Error(err as string);
  }
}

function hasXmlParserError(doc: Document) {
  return doc.getElementsByTagName('parsererror')[0]?.textContent;
}

export function serializeXmlString(elem: Node): string {
  return new XMLSerializer().serializeToString(elem);
}

export class XmlParser {
  elements(elem: Element, localName: string = null!): Element[] {
    const result: Element[] = [];

    for (let i = 0, l = elem.childNodes.length; i < l; i++) {
      const c = elem.childNodes.item(i);
      // 找到元素节点
      if (c.nodeType === 1 && (localName == null || (c as Element).localName === localName)) {
        result.push(c as Element);
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

  elementAttr(elem: Element, localName: string, attrLocalName: string): string {
    const el = this.element(elem, localName);
    return el ? this.attr(el, attrLocalName) : '';
  }

  // 获取XML元素上的属性
  attr(elem: Element, localName: string): string {
    for (let i = 0, l = elem.attributes.length; i < l; i++) {
      const a = elem.attributes.item(i);

      if (a?.localName === localName) { return a.value; }
    }

    return '';
  }

  intAttr(node: Element, attrName: string, defaultValue: number = null!): number {
    const val = this.attr(node, attrName);
    return val ? parseInt(val) : defaultValue;
  }

  hexAttr(node: Element, attrName: string, defaultValue: number = null!): number {
    const val = this.attr(node, attrName);
    return val ? parseInt(val, 16) : defaultValue;
  }

  floatAttr(node: Element, attrName: string, defaultValue: number = null!): number {
    const val = this.attr(node, attrName);
    return val ? parseFloat(val) : defaultValue;
  }

  boolAttr(node: Element, attrName: string, defaultValue: boolean = null!) {
    return convertBoolean(this.attr(node, attrName), defaultValue);
  }

  lengthAttr(node: Element, attrName: string, usage: LengthUsageType = LengthUsage.Dxa): Length {
    return convertLength(this.attr(node, attrName), usage);
  }
}

const globalXmlParser = new XmlParser();

export default globalXmlParser;

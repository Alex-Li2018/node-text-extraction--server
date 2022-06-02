import { XmlParser } from '../parser/xml-parser';

export interface CustomProperty {
  formatId: string | null;
  name: string | null;
  type: string | null;
  value: string | null;
}

export function parseCustomProps(root: Element, xml: XmlParser): CustomProperty[] {
  return xml.elements(root, 'property').map(e => {
    const firstChild = e.firstChild;

    return {
      formatId: xml.attr(e, 'fmtid'),
      name: xml.attr(e, 'name'),
      type: (firstChild as Element).nodeName,
      value: (firstChild as Element).textContent,
    };
  });
}

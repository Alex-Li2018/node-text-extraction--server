import { XmlParser } from '../parser/xml-parser';

export interface CorePropsDeclaration {
  title: string | null,
  description: string | null,
  subject: string | null,
  creator: string | null,
  keywords: string | null,
  language: string | null,
  lastModifiedBy: string | null,
  revision: number | null,
}

// 获取word的核心属性
export function parseCoreProps(root: Element, xmlParser: XmlParser): CorePropsDeclaration {
  const result = <CorePropsDeclaration>{
    title: null,
    description: null,
    subject: null,
    creator: null,
    keywords: null,
    language: null,
    lastModifiedBy: null,
    revision: null,
  };

  for (const el of xmlParser.elements(root)) {
    switch (el.localName) {
      case 'title': result.title = el.textContent; break;
      case 'description': result.description = el.textContent; break;
      case 'subject': result.subject = el.textContent; break;
      case 'creator': result.creator = el.textContent; break;
      case 'keywords': result.keywords = el.textContent; break;
      case 'language': result.language = el.textContent; break;
      case 'lastModifiedBy': result.lastModifiedBy = el.textContent; break;
      case 'revision': el.textContent && (result.revision = parseInt(el.textContent)); break;
      default: break;
    }
  }

  return result;
}

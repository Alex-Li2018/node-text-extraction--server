import { XmlParser } from '../parser/xml-parser';

export interface ExtendedPropsDeclaration {
  template: string,
  totalTime: number,
  pages: number | null,
  words: number | null,
  characters: number | null,
  application: string,
  lines: number | null,
  paragraphs: number | null,
  company: string,
  appVersion: string
}

// doc app.xml 包含字数 篇幅 行数 公司 版本
export function parseExtendedProps(root: Element, xmlParser: XmlParser): ExtendedPropsDeclaration {
  const result = <ExtendedPropsDeclaration>{

  };

  for (const el of xmlParser.elements(root)) {
    switch (el.localName) {
      case 'Template':
        result.template = el.textContent || '';
        break;
      case 'Pages':
        result.pages = safeParseToInt(el.textContent);
        break;
      case 'Words':
        result.words = safeParseToInt(el.textContent);
        break;
      case 'Characters':
        result.characters = safeParseToInt(el.textContent);
        break;
      case 'Application':
        result.application = el.textContent || '';
        break;
      case 'Lines':
        result.lines = safeParseToInt(el.textContent);
        break;
      case 'Paragraphs':
        result.paragraphs = safeParseToInt(el.textContent);
        break;
      case 'Company':
        result.company = el.textContent || '';
        break;
      case 'AppVersion':
        result.appVersion = el.textContent || '';
        break;
      default: break;
    }
  }

  return result;
}

function safeParseToInt(value: string | undefined | null): number | null {
  if (typeof value === 'undefined') { return null; }
  if (value === null) { return null; }
  return parseInt(value);
}

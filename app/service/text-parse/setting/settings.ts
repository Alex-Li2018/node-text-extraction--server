import { Length } from '../document/common';
import { XmlParser } from '../parser/xml-parser';

export interface WmlSettings {
  defaultTabStop: Length;
  footnoteProps: NoteProperties;
  endnoteProps: NoteProperties;
  autoHyphenation: boolean;
}

export interface NoteProperties {
  nummeringFormat: string;
  defaultNoteIds: string[];
}

// 页眉 也脚
export function parseSettings(elem: Element, xml: XmlParser) {
  const result = {} as WmlSettings;

  for (const el of xml.elements(elem)) {
    switch (el.localName) {
      case 'defaultTabStop': result.defaultTabStop = xml.lengthAttr(el, 'val'); break;
      case 'footnotePr': result.footnoteProps = parseNoteProperties(el, xml); break;
      case 'endnotePr': result.endnoteProps = parseNoteProperties(el, xml); break;
      case 'autoHyphenation': result.autoHyphenation = xml.boolAttr(el, 'val'); break;
      default: break;
    }
  }

  return result;
}

export function parseNoteProperties(elem: Element, xml: XmlParser) {
  const result = {
    defaultNoteIds: [] as string[],
  } as NoteProperties;

  for (const el of xml.elements(elem)) {
    switch (el.localName) {
      case 'numFmt':
        result.nummeringFormat = xml.attr(el, 'val');
        break;
      case 'footnote':
      case 'endnote':
        result.defaultNoteIds.push(xml.attr(el, 'id'));
        break;
      default:
        break;
    }
  }

  return result;
}

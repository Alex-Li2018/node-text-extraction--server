import { XmlParser } from '../parser/xml-parser';

export class DmlTheme {
  colorScheme: DmlColorScheme;
  fontScheme: DmlFontScheme;
}

export interface DmlColorScheme {
  name: string;
  colors: Record<string, string>;
}

export interface DmlFontScheme {
  name: string;
  majorFont: DmlFormInfo,
  minorFont: DmlFormInfo
}

export interface DmlFormInfo {
  latinTypeface: string;
  eaTypeface: string;
  csTypeface: string;
}

export function parseTheme(elem: Element, xml: XmlParser) {
  const result = new DmlTheme();
  const themeElements = xml.element(elem, 'themeElements');

  for (const el of xml.elements(themeElements as Element)) {
    switch (el.localName) {
      case 'clrScheme': result.colorScheme = parseColorScheme(el, xml); break;
      case 'fontScheme': result.fontScheme = parseFontScheme(el, xml); break;
      default: break;
    }
  }

  return result;
}

export function parseColorScheme(elem: Element, xml: XmlParser) {
  const result: DmlColorScheme = {
    name: xml.attr(elem, 'name'),
    colors: {},
  };

  for (const el of xml.elements(elem)) {
    const srgbClr = xml.element(el, 'srgbClr');
    const sysClr = xml.element(el, 'sysClr');

    if (srgbClr) {
      result.colors[el.localName] = xml.attr(srgbClr, 'val');
    } else if (sysClr) {
      result.colors[el.localName] = xml.attr(sysClr, 'lastClr');
    }
  }

  return result;
}

export function parseFontScheme(elem: Element, xml: XmlParser) {
  const result: DmlFontScheme = {
    name: xml.attr(elem, 'name'),
  } as DmlFontScheme;

  for (const el of xml.elements(elem)) {
    switch (el.localName) {
      case 'majorFont': result.majorFont = parseFontInfo(el, xml); break;
      case 'minorFont': result.minorFont = parseFontInfo(el, xml); break;
      default: break;
    }
  }

  return result;
}

export function parseFontInfo(elem: Element, xml: XmlParser): DmlFormInfo {
  return {
    latinTypeface: xml.elementAttr(elem, 'latin', 'typeface'),
    eaTypeface: xml.elementAttr(elem, 'ea', 'typeface'),
    csTypeface: xml.elementAttr(elem, 'cs', 'typeface'),
  };
}

import { ParagraphProperties, parseParagraphProperties } from '../document/paragraph';
import { parseRunProperties, RunProperties } from '../document/run';
import { XmlParser } from '../parser/xml-parser';

export interface NumberingPartProperties {
  numberings: Numbering[];
  abstractNumberings: AbstractNumbering[];
  bulletPictures: NumberingBulletPicture[];
}

export interface Numbering {
  id: string;
  abstractId?: string;
  overrides: NumberingLevelOverride[];
}

export interface NumberingLevelOverride {
  level: number;
  start: number;
  numberingLevel: NumberingLevel;
}

export interface AbstractNumbering {
  id: string;
  name: string;
  multiLevelType: 'singleLevel' | 'multiLevel' | 'hybridMultilevel' | string;
  levels: NumberingLevel[];
  numberingStyleLink: string;
  styleLink: string;
}

export interface NumberingLevel {
  level: number;
  start: string;
  restart: number;
  format: 'lowerRoman' | 'lowerLetter' | string;
  text: string;
  justification: string;
  bulletPictureId: string;
  paragraphStyle: string;
  paragraphProps: ParagraphProperties;
  runProps: RunProperties;
}

export interface NumberingBulletPicture {
  id: string;
  referenceId: string;
  style: string;
}

export function parseNumberingPart(elem: Element, xml: XmlParser): NumberingPartProperties {
  const result: NumberingPartProperties = {
    numberings: [],
    abstractNumberings: [],
    bulletPictures: [],
  };

  for (const e of xml.elements(elem)) {
    switch (e.localName) {
      case 'num':
        result.numberings.push(parseNumbering(e, xml));
        break;
      case 'abstractNum':
        result.abstractNumberings.push(parseAbstractNumbering(e, xml));
        break;
      case 'numPicBullet': {
        const res = parseNumberingBulletPicture(e, xml);
        res && result.bulletPictures.push(res);
        break;
      }
      default:
        break;
    }
  }

  return result;
}

export function parseNumbering(elem: Element, xml: XmlParser): Numbering {
  const result = <Numbering>{
    id: xml.attr(elem, 'numId'),
    overrides: [] as NumberingLevelOverride[],
  };

  for (const e of xml.elements(elem)) {
    switch (e.localName) {
      case 'abstractNumId':
        result.abstractId = xml.attr(e, 'val');
        break;
      case 'lvlOverride':
        result.overrides.push(parseNumberingLevelOverrride(e, xml));
        break;
      default:
        break;
    }
  }

  return result;
}

export function parseAbstractNumbering(elem: Element, xml: XmlParser): AbstractNumbering {
  const result = <AbstractNumbering>{
    id: xml.attr(elem, 'abstractNumId'),
    levels: [] as NumberingLevel[],
  };

  for (const e of xml.elements(elem)) {
    switch (e.localName) {
      case 'name':
        result.name = xml.attr(e, 'val');
        break;
      case 'multiLevelType':
        result.multiLevelType = xml.attr(e, 'val');
        break;
      case 'numStyleLink':
        result.numberingStyleLink = xml.attr(e, 'val');
        break;
      case 'styleLink':
        result.styleLink = xml.attr(e, 'val');
        break;
      case 'lvl':
        result.levels.push(parseNumberingLevel(e, xml));
        break;
      default:
        break;
    }
  }

  return result;
}

export function parseNumberingLevel(elem: Element, xml: XmlParser): NumberingLevel {
  const result = <NumberingLevel>{
    level: xml.intAttr(elem, 'ilvl'),
  };

  for (const e of xml.elements(elem)) {
    switch (e.localName) {
      case 'start':
        result.start = xml.attr(e, 'val');
        break;
      case 'lvlRestart':
        result.restart = xml.intAttr(e, 'val');
        break;
      case 'numFmt':
        result.format = xml.attr(e, 'val');
        break;
      case 'lvlText':
        result.text = xml.attr(e, 'val');
        break;
      case 'lvlJc':
        result.justification = xml.attr(e, 'val');
        break;
      case 'lvlPicBulletId':
        result.bulletPictureId = xml.attr(e, 'val');
        break;
      case 'pStyle':
        result.paragraphStyle = xml.attr(e, 'val');
        break;
      case 'pPr':
        result.paragraphProps = parseParagraphProperties(e, xml);
        break;
      case 'rPr':
        result.runProps = parseRunProperties(e, xml);
        break;
      default:
        break;
    }
  }

  return result;
}

export function parseNumberingLevelOverrride(elem: Element, xml: XmlParser): NumberingLevelOverride {
  const result = <NumberingLevelOverride>{
    level: xml.intAttr(elem, 'ilvl'),
  };

  for (const e of xml.elements(elem)) {
    switch (e.localName) {
      case 'startOverride':
        result.start = xml.intAttr(e, 'val');
        break;
      case 'lvl':
        result.numberingLevel = parseNumberingLevel(e, xml);
        break;
      default:
        break;
    }
  }

  return result;
}

export function parseNumberingBulletPicture(elem: Element, xml: XmlParser): NumberingBulletPicture | null {
  // TODO
  const pict = xml.element(elem, 'pict');
  const shape = pict && xml.element(pict, 'shape');
  const imagedata = shape && xml.element(shape, 'imagedata');

  return imagedata ? {
    id: xml.attr(elem, 'numPicBulletId'),
    referenceId: xml.attr(imagedata, 'id'),
    style: xml.attr(shape as Element, 'style'),
  } : null;
}

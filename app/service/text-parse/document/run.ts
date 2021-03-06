import { XmlParser } from '../parser/xml-parser';
import { CommonProperties, parseCommonProperty } from './common';
import { OpenXmlElement } from './dom';

export interface WmlRun extends OpenXmlElement, RunProperties {
  id?: string;
  verticalAlign?: string | null;
  fieldRun?: boolean;
}

export interface RunProperties extends CommonProperties {

}

export function parseRunProperties(elem: Element, xml: XmlParser): RunProperties {
  const result = <RunProperties>{};

  for (const el of xml.elements(elem)) {
    parseRunProperty(el, result, xml);
  }

  return result;
}

export function parseRunProperty(elem: Element, props: RunProperties, xml: XmlParser) {
  if (parseCommonProperty(elem, props, xml)) { return true; }

  return false;
}

import { WordDocument } from './word-document';
import { DocumentParser } from './document-parser';
export interface Options {
  inWrapper: boolean;
  ignoreWidth: boolean;
  ignoreHeight: boolean;
  ignoreFonts: boolean;
  breakPages: boolean;
  debug: boolean;
  experimental: boolean;
  className: string;
  trimXmlDeclaration: boolean;
  renderHeaders: boolean;
  renderFooters: boolean;
  renderFootnotes: boolean;
  renderEndnotes: boolean;
  ignoreLastRenderedPageBreak: boolean;
  useBase64URL: boolean;
}

export const defaultOptions: Options = {
  ignoreHeight: false,
  ignoreWidth: false,
  ignoreFonts: false,
  breakPages: true,
  debug: false,
  experimental: false,
  className: 'docx',
  inWrapper: true,
  trimXmlDeclaration: true,
  ignoreLastRenderedPageBreak: true,
  renderHeaders: true,
  renderFooters: true,
  renderFootnotes: true,
  renderEndnotes: true,
  useBase64URL: false,
};

// Partial将Options里的属性都变为可选 https://www.becomebetterprogrammer.com/typescript-partial-type/
export function praseAsync(data: Blob | any, userOptions: Partial<Options>): Promise<any> {
  const ops = { ...defaultOptions, ...userOptions };
  return WordDocument.load(data, new DocumentParser(ops), ops);
}

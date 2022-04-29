import { WordDocument } from './wordDocument';

export interface Options {
  inWrapper?: boolean;
  ignoreWidth?: boolean;
  ignoreHeight?: boolean;
  ignoreFonts?: boolean;
  breakPages?: boolean;
  debug?: boolean;
  experimental?: boolean;
  className?: string;
  trimXmlDeclaration?: boolean;
}

export const defaultOptions: Options = {
  ignoreHeight: false,
  ignoreWidth: false,
  ignoreFonts: false,
  breakPages: true,
  debug: false,
  experimental: false,
  className: 'docx',
  trimXmlDeclaration: true,
};

export function praseAsync(data: Blob | any, userOptions: Options | any): Promise<any> {
  const ops = { ...defaultOptions, ...userOptions };
  return WordDocument.load(data, ops);
}

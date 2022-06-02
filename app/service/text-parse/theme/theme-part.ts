import { OpenXmlPackage } from '../common/open-xml-package';
import { Part } from '../common/part';
import { DmlTheme, parseTheme } from './theme';

export class ThemePart extends Part {
  theme: DmlTheme;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(pkg: OpenXmlPackage, path: string) {
    super(pkg, path);
  }

  parseXml(root: Element) {
    this.theme = parseTheme(root, this._package.xmlParser);
  }
}

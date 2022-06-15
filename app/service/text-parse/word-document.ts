import { OutputType } from 'jszip';

import { formatParagraphText } from './formatParentWordData';
import { DocumentParser } from './document-parser';
import { Relationship, RelationshipTypes } from './common/relationship';
import { Part } from './common/part';
import { FontTablePart } from './font-table/font-table';
import { OpenXmlPackage } from './common/open-xml-package';
import { DocumentPart } from './document/document-part';
import { blobToBase64, resolvePath, splitPath } from './utils';
import { NumberingPart } from './numbering/numbering-part';
import { StylesPart } from './styles/styles-part';
import { FooterPart, HeaderPart } from './header-footer/parts';
import { ExtendedPropsPart } from './document-props/extended-props-part';
import { CorePropsPart } from './document-props/core-props-part';
import { ThemePart } from './theme/theme-part';
import { EndnotesPart, FootnotesPart } from './notes/parts';
import { SettingsPart } from './settings/settings-part';
import { CustomPropsPart } from './document-props/custom-props-part';

const topLevelRels = [
  { type: RelationshipTypes.OfficeDocument, target: 'word/document.xml' },
  { type: RelationshipTypes.ExtendedProperties, target: 'docProps/app.xml' },
  { type: RelationshipTypes.CoreProperties, target: 'docProps/core.xml' },
  { type: RelationshipTypes.CustomProperties, target: 'docProps/custom.xml' },
];
export class WordDocument {
  private _package: OpenXmlPackage;
  private _parser: DocumentParser;
  private _options: any;

  rels: Relationship[];
  parts: Part[] = [];
  partsMap: Record<string, Part> = {};

  documentPart: DocumentPart;
  fontTablePart: FontTablePart;
  numberingPart: NumberingPart;
  stylesPart: StylesPart;
  footnotesPart: FootnotesPart;
  endnotesPart: EndnotesPart;
  themePart: ThemePart;
  corePropsPart: CorePropsPart;
  extendedPropsPart: ExtendedPropsPart;
  settingsPart: SettingsPart;

  static load(blob, parser: DocumentParser, options: any): Promise<any> {
    const d = new WordDocument();

    d._options = options;
    d._parser = parser;
    // 打开openXmlPackage解压xml的压缩包
    return OpenXmlPackage.load(blob, options)
      .then(pkg => {
        // pkg是OpenXmlPackage的实例
        d._package = pkg;
        // 从顶级入口找到所有依赖
        return d._package.loadRelationships();
      }).then(rels => {
        // rels就是relationships的子元素
        /**
					id: string,
					type: RelationshipTypes | string,
					target: string
					targetMode: "" | string
				 */
        d.rels = rels;

        const tasks = topLevelRels.map(rel => {
          const r = rels.find(x => x.type === rel.type) ?? rel; // fallback

          return d.loadRelationshipPart(r.target, r.type);
        });

        return Promise.all(tasks);
      })
      .then(() => {
        return d.formatDocxData(d);
      });
  }

  save(type = 'blob'): Promise<any> {
    return this._package.save(type);
  }

  private formatDocxData(word: WordDocument): any[] {
    interface WordObject {
      type: string;
      body?: any;
      props?: any,
      path: string;
      rels?: any
    }
    const arr: WordObject[] = [];

    word.documentPart && arr.push({
      type: 'documentPart',
      body: formatParagraphText(word.documentPart?.body),
      path: word.documentPart?.path,
      // rels: word.documentPart?.rels,
    });

    word.extendedPropsPart && arr.push({
      type: 'extendedPropsPart',
      props: word.extendedPropsPart?.props,
      path: word.extendedPropsPart?.path,
      // rels: word.extendedPropsPart?.rels,
    });

    word.footnotesPart && arr.push({
      type: 'footnotesPart',
      props: word.footnotesPart?.notes,
      path: word.footnotesPart?.path,
      // rels: word.footnotesPart?.rels,
    });

    word.settingsPart && arr.push({
      type: 'settingsPart',
      props: word.settingsPart?.settings,
      path: word.settingsPart?.path,
      // rels: word.settingsPart?.rels,
    });

    word.stylesPart && arr.push({
      type: 'stylesPart',
      props: word.stylesPart?.styles,
      path: word.stylesPart?.path,
      // rels: word.stylesPart?.rels,
    });

    word.themePart && arr.push({
      type: 'themePart',
      props: word.themePart?.theme,
      path: word.themePart?.path,
      // rels: word.themePart?.rels,
    });

    word.corePropsPart && arr.push({
      type: 'corePropsPart',
      props: word.corePropsPart?.props,
      path: word.corePropsPart?.path,
      // rels: word.corePropsPart?.rels,
    });

    word.endnotesPart && arr.push({
      type: 'endnotesPart',
      props: word.endnotesPart?.notes,
      path: word.endnotesPart?.path,
      // rels: word.endnotesPart?.rels,
    });

    word.numberingPart && arr.push({
      type: 'numberingPart',
      props: word.numberingPart?.domNumberings,
      path: word.numberingPart?.path,
      // rels: word.numberingPart?.rels,
    });

    word.fontTablePart && arr.push({
      type: 'fontTablePart',
      props: word.fontTablePart?.fonts,
      path: word.fontTablePart?.path,
      // rels: word.fontTablePart?.rels,
    });

    return arr;
  }

  private loadRelationshipPart(path: string, type: string): Promise<Part | null> {
    if (this.partsMap[path]) { return Promise.resolve(this.partsMap[path]); }

    if (!this._package.get(path)) { return Promise.resolve(null); }

    let part: Part | null = null;

    switch (type) {
      case RelationshipTypes.OfficeDocument:
        this.documentPart = part = new DocumentPart(this._package, path, this._parser);
        break;

      case RelationshipTypes.FontTable:
        this.fontTablePart = part = new FontTablePart(this._package, path);
        break;

      case RelationshipTypes.Numbering:
        this.numberingPart = part = new NumberingPart(this._package, path, this._parser);
        break;

      case RelationshipTypes.Styles:
        this.stylesPart = part = new StylesPart(this._package, path, this._parser);
        break;

      case RelationshipTypes.Theme:
        this.themePart = part = new ThemePart(this._package, path);
        break;

      case RelationshipTypes.Footnotes:
        this.footnotesPart = part = new FootnotesPart(this._package, path, this._parser);
        break;

      case RelationshipTypes.Endnotes:
        this.endnotesPart = part = new EndnotesPart(this._package, path, this._parser);
        break;

      case RelationshipTypes.Footer:
        part = new FooterPart(this._package, path, this._parser);
        break;

      case RelationshipTypes.Header:
        part = new HeaderPart(this._package, path, this._parser);
        break;

      case RelationshipTypes.CoreProperties:
        this.corePropsPart = part = new CorePropsPart(this._package, path);
        break;

      case RelationshipTypes.ExtendedProperties:
        this.extendedPropsPart = part = new ExtendedPropsPart(this._package, path);
        break;

      case RelationshipTypes.CustomProperties:
        part = new CustomPropsPart(this._package, path);
        break;

      case RelationshipTypes.Settings:
        this.settingsPart = part = new SettingsPart(this._package, path);
        break;
      default: break;
    }

    if (part == null) { return Promise.resolve(null); }

    this.partsMap[path] = part;
    this.parts.push(part);

    return part.load().then(() => {
      if (part?.rels === null || part?.rels?.length === 0) {
        return part;
      }

      const [ folder ] = splitPath(part?.path as string);
      const rels = part?.rels.map(rel => {
        return this.loadRelationshipPart(resolvePath(rel.target, folder), rel.type);
      });

      return Promise.all(rels as any).then(() => part);
    });
  }

  loadDocumentImage(id: string, part?: Part): PromiseLike<string> {
    return this.loadResource(part ?? this.documentPart, id, 'blob')
      .then(x => this.blobToURL(x));
  }

  loadNumberingImage(id: string): PromiseLike<string> {
    return this.loadResource(this.numberingPart, id, 'blob')
      .then(x => this.blobToURL(x));
  }

  loadFont(id: string, key: string): PromiseLike<string> {
    return this.loadResource(this.fontTablePart, id, 'uint8array')
      .then(x => (x ? this.blobToURL(new Blob([ deobfuscate(x, key) ])) : x));
  }

  private blobToURL(blob: Blob): string | PromiseLike<string> {
    if (!blob) { return ''; }

    if (this._options.useBase64URL) {
      return blobToBase64(blob);
    }

    return URL.createObjectURL(blob);
  }

  findPartByRelId(id: string, basePart: Part = null!) {
    const rel = (basePart.rels ?? this.rels).find(r => r.id === id);
    const folder = basePart ? splitPath(basePart.path)[0] : '';
    return rel ? this.partsMap[resolvePath(rel.target, folder)] : null;
  }

  getPathById(part: Part, id: string): string | null {
    const rel = part.rels.find(x => x.id === id);
    const [ folder ] = splitPath(part.path);
    return rel && rel.target ? resolvePath(rel.target, folder) : null;
  }

  private loadResource(part: Part, id: string, outputType: OutputType) {
    const path = this.getPathById(part, id);
    return path ? this._package.load(path, outputType) : Promise.resolve(null);
  }
}

export function deobfuscate(data: Uint8Array, guidKey: string): Uint8Array {
  const len = 16;
  const trimmed = guidKey.replace(/{|}|-/g, '');
  const numbers = new Array(len);

  for (let i = 0; i < len; i++) { numbers[len - i - 1] = parseInt(trimmed.substr(i * 2, 2), 16); }

  // eslint-disable-next-line no-bitwise
  for (let i = 0; i < 32; i++) { data[i] = data[i] ^ numbers[i % len]; }

  return data;
}

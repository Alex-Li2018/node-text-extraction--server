import * as JSZip from 'jszip';
import { parseXmlString, XmlParser } from '../parser/xml-parser';
import { splitPath } from '../utils';
import { parseRelationships, Relationship } from './relationship';

export interface OpenXmlPackageOptions {
  trimXmlDeclaration: boolean,
  keepOrigin: boolean,
}

// 解压缩文件
export class OpenXmlPackage {
  xmlParser: XmlParser = new XmlParser();

  // _zip是jsZip解压出的内容
  constructor(private _zip: JSZip, public options: OpenXmlPackageOptions) {
  }

  get(path: string): any {
    return this._zip.files[normalizePath(path)];
  }

  update(path: string, content: any) {
    this._zip.file(path, content);
  }

  static load(input: Blob | any, options: OpenXmlPackageOptions): Promise<OpenXmlPackage> {
    // 返回的是压缩包里的文件
    return JSZip.loadAsync(input).then(zip => new OpenXmlPackage(zip, options));
  }

  save(type: any = 'blob'): Promise<any> {
    return this._zip.generateAsync({ type });
  }

  load(path: string, type: JSZip.OutputType = 'string'): Promise<any> {
    return this.get(path)?.async(type) ?? Promise.resolve(null);
  }

  loadRelationships(path: string = null!): Promise<Relationship[]> {
    let relsPath = '_rels/.rels';

    if (path != null) {
      const [ f, fn ] = splitPath(path);
      relsPath = `${f}_rels/${fn}.rels`;
    }
    // 进入relationship的函数
    return this.load(relsPath)
      .then(txt => {
        if (txt) {
          const el = this.parseXmlDocument(txt).firstElementChild;
          return el ? parseRelationships(el, this.xmlParser) : [];
        }

        return [];
      });
  }

  /** @internal */
  parseXmlDocument(txt: string): Document {
    // 返回domTree
    return parseXmlString(txt, this.options.trimXmlDeclaration);
  }
}

function normalizePath(path: string) {
  return path.startsWith('/') ? path.substr(1) : path;
}

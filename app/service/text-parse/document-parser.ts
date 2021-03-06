/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-bitwise */
import {
  DomType, WmlTable, IDomNumbering,
  WmlHyperlink, IDomImage, OpenXmlElement, WmlTableColumn, WmlTableCell,
  WmlTableRow, NumberingPicBullet, WmlText, WmlSymbol, WmlBreak, WmlNoteReference,
} from './document/dom';
import { DocumentElement } from './document/document';
import { WmlParagraph, parseParagraphProperties, parseParagraphProperty } from './document/paragraph';
import { parseSectionProperties } from './document/section';
import xml from './parser/xml-parser';
import { parseRunProperties, WmlRun } from './document/run';
import { parseBookmarkEnd, parseBookmarkStart } from './document/bookmarks';
import { IDomStyle, IDomSubStyle } from './document/style';
import { WmlFieldChar, WmlFieldSimple, WmlInstructionText } from './document/fields';
import { convertLength, LengthUsage, LengthUsageType } from './document/common';
import { VmlShape } from './document/vector';

export const autos = {
  shd: 'inherit',
  color: 'black',
  borderColor: 'black',
  highlight: 'transparent',
};

export interface DocumentParserOptions {
  ignoreWidth: boolean;
  debug: boolean;
}

export class DocumentParser {
  options: DocumentParserOptions;

  constructor(options?: Partial<DocumentParserOptions>) {
    this.options = {
      ignoreWidth: false,
      debug: false,
      ...options,
    };
  }

  parseNotes(xmlDoc: Element, elemName: string, elemClass: any): any[] {
    const result: Array<any> = [];

    for (const el of xml.elements(xmlDoc, elemName)) {
      const node = new elemClass();
      node.id = xml.attr(el, 'id');
      node.noteType = xml.attr(el, 'type');
      node.children = this.parseBodyElements(el);
      result.push(node);
    }

    return result;
  }

  // 解析word/document.xml文件
  parseDocumentFile(xmlDoc: Element): DocumentElement {
    // 对应原文的w:body word的内容
    const xbody = xml.element(xmlDoc, 'body');
    const background = xml.element(xmlDoc, 'background');
    // 对应原文的w:sectPr 包含尺寸 行高 边距等信息
    const sectPr = xml.element(xbody as Element, 'sectPr');

    return {
      type: DomType.Document,
      children: this.parseBodyElements(xbody as Element),
      props: sectPr ? parseSectionProperties(sectPr, xml) : null,
      cssStyle: background ? this.parseBackground(background) : {},
    };
  }

  parseBackground(elem: Element): any {
    const result = {};
    const color = xmlUtil.colorAttr(elem, 'color');

    if (color) {
      result['background-color'] = color;
    }

    return result;
  }

  // 解析body的元素
  parseBodyElements(element: Element): OpenXmlElement[] {
    const children: Array<any> = [];

    xmlUtil.foreach(element, elem => {
      switch (elem.localName) {
        case 'p':
          children.push(this.parseParagraph(elem));
          break;

        case 'tbl':
          children.push(this.parseTable(elem));
          break;

        case 'sdt':
          this.parseSdt(elem).forEach(el => children.push(el));
          break;
        default: break;
      }
    });

    return children;
  }

  parseStylesFile(xstyles: Element): IDomStyle[] {
    const result: Array<any> = [];

    xmlUtil.foreach(xstyles, n => {
      switch (n.localName) {
        case 'style':
          result.push(this.parseStyle(n));
          break;

        case 'docDefaults':
          result.push(this.parseDefaultStyles(n));
          break;
        default: break;
      }
    });

    return result;
  }

  parseDefaultStyles(node: Element): IDomStyle {
    const result = <IDomStyle>{
      id: null,
      name: null,
      target: null,
      basedOn: null,
      styles: [] as IDomSubStyle[],
    };

    xmlUtil.foreach(node, c => {
      switch (c.localName) {
        case 'rPrDefault': {
          const rPr = xml.element(c, 'rPr');

          if (rPr) {
            result.styles.push({
              target: 'span',
              values: this.parseDefaultProperties(rPr, {}),
            });
          }
          break;
        }

        case 'pPrDefault': {
          const pPr = xml.element(c, 'pPr');

          if (pPr) {
            result.styles.push({
              target: 'p',
              values: this.parseDefaultProperties(pPr, {}),
            });
          }
          break;
        }
        default: break;
      }
    });

    return result;
  }

  parseStyle(node: Element): IDomStyle {
    const result = <IDomStyle>{
      id: xml.attr(node, 'styleId'),
      isDefault: xml.boolAttr(node, 'default'),
      name: null,
      target: null,
      basedOn: null,
      styles: [] as IDomSubStyle[],
      linked: null,
    };

    switch (xml.attr(node, 'type')) {
      case 'paragraph': result.target = 'p'; break;
      case 'table': result.target = 'table'; break;
      case 'character': result.target = 'span'; break;
        // case "numbering": result.target = "p"; break;
      default: break;
    }

    xmlUtil.foreach(node, n => {
      switch (n.localName) {
        case 'basedOn':
          result.basedOn = xml.attr(n, 'val');
          break;

        case 'name':
          result.name = xml.attr(n, 'val');
          break;

        case 'link':
          result.linked = xml.attr(n, 'val');
          break;

        case 'next':
          result.next = xml.attr(n, 'val');
          break;

        case 'aliases':
          result.aliases = xml.attr(n, 'val').split(',');
          break;

        case 'pPr':
          result.styles.push({
            target: 'p',
            values: this.parseDefaultProperties(n, {}),
          });
          result.paragraphProps = parseParagraphProperties(n, xml);
          break;

        case 'rPr':
          result.styles.push({
            target: 'span',
            values: this.parseDefaultProperties(n, {}),
          });
          result.runProps = parseRunProperties(n, xml);
          break;

        case 'tblPr':
        case 'tcPr':
          result.styles.push({
            target: 'td', // TODO: maybe move to processor
            values: this.parseDefaultProperties(n, {}),
          });
          break;

        case 'tblStylePr':
          for (const s of this.parseTableStyle(n)) { result.styles.push(s); }
          break;

        case 'rsid':
        case 'qFormat':
        case 'hidden':
        case 'semiHidden':
        case 'unhideWhenUsed':
        case 'autoRedefine':
        case 'uiPriority':
          // TODO: ignore
          break;

        default:
          this.options.debug && console.warn(`DOCX: Unknown style element: ${n.localName}`);
      }
    });

    return result;
  }

  parseTableStyle(node: Element): IDomSubStyle[] {
    const result: Array<any> = [];

    const type = xml.attr(node, 'type');
    let selector = '';
    let modificator = '';

    switch (type) {
      case 'firstRow':
        modificator = '.first-row';
        selector = 'tr.first-row td';
        break;
      case 'lastRow':
        modificator = '.last-row';
        selector = 'tr.last-row td';
        break;
      case 'firstCol':
        modificator = '.first-col';
        selector = 'td.first-col';
        break;
      case 'lastCol':
        modificator = '.last-col';
        selector = 'td.last-col';
        break;
      case 'band1Vert':
        modificator = ':not(.no-vband)';
        selector = 'td.odd-col';
        break;
      case 'band2Vert':
        modificator = ':not(.no-vband)';
        selector = 'td.even-col';
        break;
      case 'band1Horz':
        modificator = ':not(.no-hband)';
        selector = 'tr.odd-row';
        break;
      case 'band2Horz':
        modificator = ':not(.no-hband)';
        selector = 'tr.even-row';
        break;
      default: return [];
    }

    xmlUtil.foreach(node, n => {
      switch (n.localName) {
        case 'pPr':
          result.push({
            target: `${selector} p`,
            mod: modificator,
            values: this.parseDefaultProperties(n, {}),
          });
          break;

        case 'rPr':
          result.push({
            target: `${selector} span`,
            mod: modificator,
            values: this.parseDefaultProperties(n, {}),
          });
          break;

        case 'tblPr':
        case 'tcPr':
          result.push({
            target: selector, // TODO: maybe move to processor
            mod: modificator,
            values: this.parseDefaultProperties(n, {}),
          });
          break;
        default: break;
      }
    });

    return result;
  }

  parseNumberingFile(xnums: Element): IDomNumbering[] {
    const result: IDomNumbering[] = [];
    const mapping = {};
    const bullets: any[] = [];

    xmlUtil.foreach(xnums, n => {
      switch (n.localName) {
        case 'abstractNum':
          this.parseAbstractNumbering(n, bullets)
            .forEach(x => result.push(x));
          break;

        case 'numPicBullet':
          bullets.push(this.parseNumberingPicBullet(n));
          break;

        case 'num': {
          const numId = xml.attr(n, 'numId');
          const abstractNumId = xml.elementAttr(n, 'abstractNumId', 'val');
          mapping[abstractNumId] = numId;
          break;
        }
        default: break;
      }
    });

    // eslint-disable-next-line no-return-assign
    result.forEach(x => x.id = mapping[x.id]);

    return result;
  }

  parseNumberingPicBullet(elem: Element): NumberingPicBullet | null {
    const pict = xml.element(elem, 'pict');
    const shape = pict && xml.element(pict, 'shape');
    const imagedata = shape && xml.element(shape, 'imagedata');

    return imagedata ? {
      id: xml.intAttr(elem, 'numPicBulletId'),
      src: xml.attr(imagedata, 'id'),
      style: xml.attr(shape as Element, 'style'),
    } : null;
  }

  parseAbstractNumbering(node: Element, bullets: any[]): IDomNumbering[] {
    const result: IDomNumbering[] = [];
    const id = xml.attr(node, 'abstractNumId');

    xmlUtil.foreach(node, n => {
      switch (n.localName) {
        case 'lvl':
          result.push(this.parseNumberingLevel(id, n, bullets));
          break;
        default: break;
      }
    });

    return result;
  }

  parseNumberingLevel(id: string, node: Element, bullets: any[]): IDomNumbering {
    const result: IDomNumbering = {
      id,
      level: xml.intAttr(node, 'ilvl'),
      pStyleName: undefined,
      pStyle: {},
      rStyle: {},
      suff: 'tab',
    };

    xmlUtil.foreach(node, n => {
      switch (n.localName) {
        case 'pPr':
          this.parseDefaultProperties(n, result.pStyle);
          break;

        case 'rPr':
          this.parseDefaultProperties(n, result.rStyle);
          break;

        case 'lvlPicBulletId': {
          const id = xml.intAttr(n, 'val');
          result.bullet = bullets.find(x => x.id === id);
          break;
        }

        case 'lvlText':
          result.levelText = xml.attr(n, 'val');
          break;

        case 'pStyle':
          result.pStyleName = xml.attr(n, 'val');
          break;

        case 'numFmt':
          result.format = xml.attr(n, 'val');
          break;

        case 'suff':
          result.suff = xml.attr(n, 'val');
          break;
        default: break;
      }
    });

    return result;
  }

  parseSdt(node: Element): OpenXmlElement[] {
    const sdtContent = xml.element(node, 'sdtContent');
    return sdtContent ? this.parseBodyElements(sdtContent) : [];
  }

  // 解析段落
  parseParagraph(node: Element): OpenXmlElement {
    const result: WmlParagraph = {
      type: DomType.Paragraph,
      children: [] as OpenXmlElement[],
    };

    xmlUtil.foreach(node, c => {
      switch (c.localName) {
        case 'r':
          (result.children as OpenXmlElement[]).push(this.parseRun(c, result));
          break;

        case 'hyperlink':
          (result.children as OpenXmlElement[]).push(this.parseHyperlink(c, result));
          break;

        case 'bookmarkStart':
          (result.children as OpenXmlElement[]).push(parseBookmarkStart(c, xml));
          break;

        case 'bookmarkEnd':
          (result.children as OpenXmlElement[]).push(parseBookmarkEnd(c, xml));
          break;

        case 'pPr':
          this.parseParagraphProperties(c, result);
          break;
        default: break;
      }
    });

    return result;
  }

  // 段落的属性 颜色 对齐方式 下划线 字体
  parseParagraphProperties(elem: Element, paragraph: WmlParagraph) {
    this.parseDefaultProperties(elem, paragraph.cssStyle = {}, undefined, c => {
      if (parseParagraphProperty(c, paragraph, xml)) { return true; }

      switch (c.localName) {
        case 'pStyle':
          paragraph.styleName = xml.attr(c, 'val');
          break;

        case 'cnfStyle':
          paragraph.className = values.classNameOfCnfStyle(c);
          break;

        case 'framePr':
          this.parseFrame(c, paragraph);
          break;

        case 'rPr':
          // TODO ignore
          break;

        default:
          return false;
      }

      return true;
    });
  }

  parseFrame(node: Element, paragraph: WmlParagraph) {
    const dropCap = xml.attr(node, 'dropCap');

    if (dropCap === 'drop' && paragraph.cssStyle) {
      paragraph.cssStyle.float = 'left';
    }
  }

  parseHyperlink(node: Element, parent?: OpenXmlElement): WmlHyperlink {
    const result: WmlHyperlink = <WmlHyperlink>{ type: DomType.Hyperlink, parent, children: [] };
    const anchor = xml.attr(node, 'anchor');

    if (anchor) { result.href = '#' + anchor; }

    xmlUtil.foreach(node, c => {
      switch (c.localName) {
        case 'r':
          (result.children as OpenXmlElement[]).push(this.parseRun(c, result));
          break;
        default: break;
      }
    });

    return result;
  }

  parseRun(node: Element, parent?: OpenXmlElement): WmlRun {
    const result: WmlRun = <WmlRun>{ type: DomType.Run, parent, children: [] };

    xmlUtil.foreach(node, c => {
      switch (c.localName) {
        case 't':
          (result.children as OpenXmlElement[]).push(<WmlText>{
            type: DomType.Text,
            text: c.textContent,
          });// .replace(" ", "\u00A0"); // TODO
          break;

        case 'fldSimple':
          (result.children as OpenXmlElement[]).push(<WmlFieldSimple>{
            type: DomType.SimpleField,
            instruction: xml.attr(c, 'instr'),
            lock: xml.boolAttr(c, 'lock', false),
            dirty: xml.boolAttr(c, 'dirty', false),
          });
          break;

        case 'instrText':
          result.fieldRun = true;
          (result.children as OpenXmlElement[]).push(<WmlInstructionText>{
            type: DomType.Instruction,
            text: c.textContent,
          });
          break;

        case 'fldChar':
          result.fieldRun = true;
          (result.children as OpenXmlElement[]).push(<WmlFieldChar>{
            type: DomType.ComplexField,
            charType: xml.attr(c, 'fldCharType'),
            lock: xml.boolAttr(c, 'lock', false),
            dirty: xml.boolAttr(c, 'dirty', false),
          });
          break;

        case 'noBreakHyphen':
          (result.children as OpenXmlElement[]).push({ type: DomType.NoBreakHyphen });
          break;

        case 'br':
          (result.children as OpenXmlElement[]).push(<WmlBreak>{
            type: DomType.Break,
            break: xml.attr(c, 'type') || 'textWrapping',
          });
          break;

        case 'lastRenderedPageBreak':
          (result.children as OpenXmlElement[]).push(<WmlBreak>{
            type: DomType.Break,
            break: 'lastRenderedPageBreak',
          });
          break;

        case 'sym':
          (result.children as OpenXmlElement[]).push(<WmlSymbol>{
            type: DomType.Symbol,
            font: xml.attr(c, 'font'),
            char: xml.attr(c, 'char'),
          });
          break;

        case 'tab':
          (result.children as OpenXmlElement[]).push({ type: DomType.Tab });
          break;

        case 'footnoteReference':
          (result.children as OpenXmlElement[]).push(<WmlNoteReference>{
            type: DomType.FootnoteReference,
            id: xml.attr(c, 'id'),
          });
          break;

        case 'endnoteReference':
          (result.children as OpenXmlElement[]).push(<WmlNoteReference>{
            type: DomType.EndnoteReference,
            id: xml.attr(c, 'id'),
          });
          break;

        case 'drawing': {
          const d = this.parseDrawing(c);

          if (d) { result.children = [ d ]; }
          break;
        }

        case 'pict':
          (result.children as OpenXmlElement[]).push(this.parseVmlPicture(c));
          break;

        case 'rPr':
          // r标签的属性
          this.parseRunProperties(c, result);
          break;

        default: break;
      }
    });

    return result;
  }

  parseRunProperties(elem: Element, run: WmlRun) {
    this.parseDefaultProperties(elem, run.cssStyle = {}, undefined, c => {
      switch (c.localName) {
        case 'rStyle':
          run.styleName = xml.attr(c, 'val');
          break;

        case 'vertAlign':
          run.verticalAlign = values.valueOfVertAlign(c, true);
          break;

        default:
          return false;
      }

      return true;
    });
  }

  parseVmlPicture(elem: Element): OpenXmlElement {
    const result = { type: DomType.VmlPicture, children: [] };

    for (const el of xml.elements(elem)) {
      switch (el.localName) {
        case 'shape':
          (result.children as OpenXmlElement[]).push(this.parseVmlShape(el));
          break;
        default: break;
      }
    }

    return result;
  }

  parseVmlShape(elem: Element): OpenXmlElement {
    const result = <VmlShape>{ type: DomType.VmlShape, children: [] };

    result.cssStyleText = xml.attr(elem, 'style');

    for (const el of xml.elements(elem)) {
      switch (el.localName) {
        case 'imagedata':
          result.imagedata = {
            id: xml.attr(el, 'id'),
            title: xml.attr(el, 'title'),
          };
          break;
        default: break;
      }
    }

    return result;
  }

  parseDrawing(node: Element) {
    for (const n of xml.elements(node)) {
      switch (n.localName) {
        case 'inline':
        case 'anchor':
          return this.parseDrawingWrapper(n);
        default: break;
      }
    }
  }

  parseDrawingWrapper(node: Element): OpenXmlElement {
    const result = <OpenXmlElement>{ type: DomType.Drawing, children: [], cssStyle: {} };
    const isAnchor = node.localName === 'anchor';

    // TODO
    // result.style["margin-left"] = xml.sizeAttr(node, "distL", SizeType.Emu);
    // result.style["margin-top"] = xml.sizeAttr(node, "distT", SizeType.Emu);
    // result.style["margin-right"] = xml.sizeAttr(node, "distR", SizeType.Emu);
    // result.style["margin-bottom"] = xml.sizeAttr(node, "distB", SizeType.Emu);

    let wrapType: 'wrapTopAndBottom' | 'wrapNone' | null = null;
    const simplePos = xml.boolAttr(node, 'simplePos');

    const posX = { relative: 'page', align: 'left', offset: '0' };
    const posY = { relative: 'page', align: 'top', offset: '0' };

    for (const n of xml.elements(node)) {
      switch (n.localName) {
        case 'simplePos':
          if (simplePos) {
            posX.offset = xml.lengthAttr(n, 'x', LengthUsage.Emu);
            posY.offset = xml.lengthAttr(n, 'y', LengthUsage.Emu);
          }
          break;

        case 'extent':
          (result.cssStyle as Record<string, string>).width = xml.lengthAttr(n, 'cx', LengthUsage.Emu);
          (result.cssStyle as Record<string, string>).height = xml.lengthAttr(n, 'cy', LengthUsage.Emu);
          break;

        case 'positionH':
        case 'positionV':
          if (!simplePos) {
            const pos = n.localName === 'positionH' ? posX : posY;
            const alignNode = xml.element(n, 'align');
            const offsetNode = xml.element(n, 'posOffset');

            pos.relative = xml.attr(n, 'relativeFrom') ?? pos.relative;

            if (alignNode) { pos.align = alignNode.textContent || ''; }

            if (offsetNode) { pos.offset = xmlUtil.sizeValue(offsetNode, LengthUsage.Emu); }
          }
          break;

        case 'wrapTopAndBottom':
          wrapType = 'wrapTopAndBottom';
          break;

        case 'wrapNone':
          wrapType = 'wrapNone';
          break;

        case 'graphic': {
          const g = this.parseGraphic(n);

          if (g) { (result.children as OpenXmlElement[]).push(g); }
          break;
        }
        default: break;
      }
    }

    if (wrapType === 'wrapTopAndBottom') {
      (result.cssStyle as Record<string, string>).display = 'block';

      if (posX.align) {
        (result.cssStyle as Record<string, string>)['text-align'] = posX.align;
        (result.cssStyle as Record<string, string>).width = '100%';
      }
    } else if (wrapType === 'wrapNone') {
      (result.cssStyle as Record<string, string>).display = 'block';
      (result.cssStyle as Record<string, string>).position = 'relative';
      (result.cssStyle as Record<string, string>).width = '0px';
      (result.cssStyle as Record<string, string>).height = '0px';

      if (posX.offset) { (result.cssStyle as Record<string, string>).left = posX.offset; }
      if (posY.offset) { (result.cssStyle as Record<string, string>).top = posY.offset; }
    } else if (isAnchor && (posX.align === 'left' || posX.align === 'right')) {
      (result.cssStyle as Record<string, string>).float = posX.align;
    }

    return result;
  }

  parseGraphic(elem: Element): OpenXmlElement | null {
    const graphicData = xml.element(elem, 'graphicData');

    for (const n of xml.elements(graphicData as Element)) {
      switch (n.localName) {
        case 'pic':
          return this.parsePicture(n);
        default: break;
      }
    }

    return null;
  }

  parsePicture(elem: Element): IDomImage {
    const result = <IDomImage>{ type: DomType.Image, src: '', cssStyle: {} };
    const blipFill = xml.element(elem, 'blipFill');
    const blip = xml.element(blipFill as Element, 'blip');

    result.src = xml.attr(blip as Element, 'embed');

    const spPr = xml.element(elem, 'spPr');
    const xfrm = xml.element(spPr as Element, 'xfrm');

    (result.cssStyle as Record<string, string>).position = 'relative';

    for (const n of xml.elements(xfrm as Element)) {
      switch (n.localName) {
        case 'ext':
          (result.cssStyle as Record<string, string>).width = xml.lengthAttr(n, 'cx', LengthUsage.Emu);
          (result.cssStyle as Record<string, string>).height = xml.lengthAttr(n, 'cy', LengthUsage.Emu);
          break;

        case 'off':
          (result.cssStyle as Record<string, string>).left = xml.lengthAttr(n, 'x', LengthUsage.Emu);
          (result.cssStyle as Record<string, string>).top = xml.lengthAttr(n, 'y', LengthUsage.Emu);
          break;
        default: break;
      }
    }

    return result;
  }

  parseTable(node: Element): WmlTable {
    const result: WmlTable = { type: DomType.Table, children: [] };

    xmlUtil.foreach(node, c => {
      switch (c.localName) {
        case 'tr':
          (result.children as OpenXmlElement[]).push(this.parseTableRow(c));
          break;

        case 'tblGrid':
          result.columns = this.parseTableColumns(c);
          break;

        case 'tblPr':
          this.parseTableProperties(c, result);
          break;
        default: break;
      }
    });

    return result;
  }

  parseTableColumns(node: Element): WmlTableColumn[] {
    const result: any[] = [];

    xmlUtil.foreach(node, n => {
      switch (n.localName) {
        case 'gridCol':
          result.push({ width: xml.lengthAttr(n, 'w') });
          break;
        default: break;
      }
    });

    return result;
  }

  parseTableProperties(elem: Element, table: WmlTable) {
    table.cssStyle = {};
    table.cellStyle = {};

    this.parseDefaultProperties(elem, table.cssStyle, table.cellStyle, c => {
      switch (c.localName) {
        case 'tblStyle':
          table.styleName = xml.attr(c, 'val');
          break;

        case 'tblLook':
          table.className = values.classNameOftblLook(c);
          break;

        case 'tblpPr':
          this.parseTablePosition(c, table);
          break;

        case 'tblStyleColBandSize':
          table.colBandSize = xml.intAttr(c, 'val');
          break;

        case 'tblStyleRowBandSize':
          table.rowBandSize = xml.intAttr(c, 'val');
          break;

        default:
          return false;
      }

      return true;
    });

    switch (table.cssStyle['text-align']) {
      case 'center':
        delete table.cssStyle['text-align'];
        table.cssStyle['margin-left'] = 'auto';
        table.cssStyle['margin-right'] = 'auto';
        break;

      case 'right':
        delete table.cssStyle['text-align'];
        table.cssStyle['margin-left'] = 'auto';
        break;
      default: break;
    }
  }

  parseTablePosition(node: Element, table: WmlTable) {
    const topFromText = xml.lengthAttr(node, 'topFromText');
    const bottomFromText = xml.lengthAttr(node, 'bottomFromText');
    const rightFromText = xml.lengthAttr(node, 'rightFromText');
    const leftFromText = xml.lengthAttr(node, 'leftFromText');

    (table.cssStyle as Record<string, string>).float = 'left';
    (table.cssStyle as Record<string, string>)['margin-bottom'] = values.addSize((table.cssStyle as Record<string, string>)['margin-bottom'], bottomFromText);
    (table.cssStyle as Record<string, string>)['margin-left'] = values.addSize((table.cssStyle as Record<string, string>)['margin-left'], leftFromText);
    (table.cssStyle as Record<string, string>)['margin-right'] = values.addSize((table.cssStyle as Record<string, string>)['margin-right'], rightFromText);
    (table.cssStyle as Record<string, string>)['margin-top'] = values.addSize((table.cssStyle as Record<string, string>)['margin-top'], topFromText);
  }

  parseTableRow(node: Element): WmlTableRow {
    const result: WmlTableRow = { type: DomType.Row, children: [] };

    xmlUtil.foreach(node, c => {
      switch (c.localName) {
        case 'tc':
          (result.children as OpenXmlElement[]).push(this.parseTableCell(c));
          break;

        case 'trPr':
          this.parseTableRowProperties(c, result);
          break;
        default: break;
      }
    });

    return result;
  }

  parseTableRowProperties(elem: Element, row: WmlTableRow) {
    row.cssStyle = this.parseDefaultProperties(elem, {}, undefined, c => {
      switch (c.localName) {
        case 'cnfStyle':
          row.className = values.classNameOfCnfStyle(c);
          break;

        case 'tblHeader':
          row.isHeader = xml.boolAttr(c, 'val');
          break;

        default:
          return false;
      }

      return true;
    });
  }

  parseTableCell(node: Element): OpenXmlElement {
    const result: WmlTableCell = { type: DomType.Cell, children: [] };

    xmlUtil.foreach(node, c => {
      switch (c.localName) {
        case 'tbl':
          (result.children as OpenXmlElement[]).push(this.parseTable(c));
          break;

        case 'p':
          (result.children as OpenXmlElement[]).push(this.parseParagraph(c));
          break;

        case 'tcPr':
          this.parseTableCellProperties(c, result);
          break;
        default: break;
      }
    });

    return result;
  }

  parseTableCellProperties(elem: Element, cell: WmlTableCell) {
    cell.cssStyle = this.parseDefaultProperties(elem, {}, undefined, c => {
      switch (c.localName) {
        case 'gridSpan':
          cell.span = xml.intAttr(c, 'val', undefined);
          break;

        case 'vMerge':
          cell.verticalMerge = xml.attr(c, 'val') ?? 'continue';
          break;

        case 'cnfStyle':
          cell.className = values.classNameOfCnfStyle(c);
          break;

        default:
          return false;
      }

      return true;
    });
  }

  parseDefaultProperties(elem: Element, style: Record<string, string> = null!, childStyle: Record<string, string> = null!, handler: (prop: Element) => boolean = null!): Record<string, string> {
    style = style || {};

    xmlUtil.foreach(elem, c => {
      if (handler?.(c)) { return; }

      switch (c.localName) {
        case 'jc':
          style['text-align'] = values.valueOfJc(c);
          break;

        case 'textAlignment':
          style['vertical-align'] = values.valueOfTextAlignment(c);
          break;

        case 'color':
          style.color = xmlUtil.colorAttr(c, 'val', undefined, autos.color);
          break;

        case 'sz':
          style['font-size'] = style['min-height'] = xml.lengthAttr(c, 'val', LengthUsage.FontSize);
          break;

        case 'shd':
          style['background-color'] = xmlUtil.colorAttr(c, 'fill', undefined, autos.shd);
          break;

        case 'highlight':
          style['background-color'] = xmlUtil.colorAttr(c, 'val', undefined, autos.highlight);
          break;

        case 'vertAlign':
          // TODO
          // style.verticalAlign = values.valueOfVertAlign(c);
          break;

        case 'position':
          style.verticalAlign = xml.lengthAttr(c, 'val', LengthUsage.FontSize);
          break;

        case 'tcW':
          if (this.options.ignoreWidth) { break; }
          break;

        case 'tblW':
          style.width = values.valueOfSize(c, 'w');
          break;

        case 'trHeight':
          this.parseTrHeight(c, style);
          break;

        case 'strike':
          style['text-decoration'] = xml.boolAttr(c, 'val', true) ? 'line-through' : 'none';
          break;

        case 'b':
          style['font-weight'] = xml.boolAttr(c, 'val', true) ? 'bold' : 'normal';
          break;

        case 'i':
          style['font-style'] = xml.boolAttr(c, 'val', true) ? 'italic' : 'normal';
          break;

        case 'caps':
          style['text-transform'] = xml.boolAttr(c, 'val', true) ? 'uppercase' : 'none';
          break;

        case 'smallCaps':
          style['text-transform'] = xml.boolAttr(c, 'val', true) ? 'lowercase' : 'none';
          break;

        case 'u':
          this.parseUnderline(c, style);
          break;

        case 'ind':
        case 'tblInd':
          this.parseIndentation(c, style);
          break;

        case 'rFonts':
          this.parseFont(c, style);
          break;

        case 'tblBorders':
          this.parseBorderProperties(c, childStyle || style);
          break;

        case 'tblCellSpacing':
          style['border-spacing'] = values.valueOfMargin(c);
          style['border-collapse'] = 'separate';
          break;

        case 'pBdr':
          this.parseBorderProperties(c, style);
          break;

        case 'bdr':
          style.border = values.valueOfBorder(c);
          break;

        case 'tcBorders':
          this.parseBorderProperties(c, style);
          break;

        case 'vanish':
          if (xml.boolAttr(c, 'val', true)) { style.display = 'none'; }
          break;

        case 'kern':
          // TODO
          // style['letter-spacing'] = xml.lengthAttr(elem, 'val', LengthUsage.FontSize);
          break;

        case 'noWrap':
          // TODO
          // style["white-space"] = "nowrap";
          break;

        case 'tblCellMar':
        case 'tcMar':
          this.parseMarginProperties(c, childStyle || style);
          break;

        case 'tblLayout':
          style['table-layout'] = values.valueOfTblLayout(c);
          break;

        case 'vAlign':
          style['vertical-align'] = values.valueOfTextAlignment(c);
          break;

        case 'spacing':
          if (elem.localName === 'pPr') { this.parseSpacing(c, style); }
          break;

        case 'wordWrap':
          if (xml.boolAttr(c, 'val')) {
            style['overflow-wrap'] = 'break-word';
          }
          break;

        case 'bCs':
        case 'iCs':
        case 'szCs':
        case 'tabs': // ignore - tabs is parsed by other parser
        case 'outlineLvl': // TODO
        case 'contextualSpacing': // TODO
        case 'tblStyleColBandSize': // TODO
        case 'tblStyleRowBandSize': // TODO
        case 'webHidden': // TODO - maybe web-hidden should be implemented
        case 'pageBreakBefore': // TODO - maybe ignore
        case 'suppressLineNumbers': // TODO - maybe ignore
        case 'keepLines': // TODO - maybe ignore
        case 'keepNext': // TODO - maybe ignore
        case 'lang':
        case 'widowControl': // TODO - maybe ignore
        case 'bidi': // TODO - maybe ignore
        case 'rtl': // TODO - maybe ignore
        case 'noProof': // ignore spellcheck
          // TODO ignore
          break;

        default:
          if (this.options.debug) { console.warn(`DOCX: Unknown document element: ${elem.localName}.${c.localName}`); }
          break;
      }
    });

    return style;
  }

  parseUnderline(node: Element, style: Record<string, string>) {
    const val = xml.attr(node, 'val');

    if (val == null) { return; }

    switch (val) {
      case 'dash':
      case 'dashDotDotHeavy':
      case 'dashDotHeavy':
      case 'dashedHeavy':
      case 'dashLong':
      case 'dashLongHeavy':
      case 'dotDash':
      case 'dotDotDash':
        style['text-decoration-style'] = 'dashed';
        break;

      case 'dotted':
      case 'dottedHeavy':
        style['text-decoration-style'] = 'dotted';
        break;

      case 'double':
        style['text-decoration-style'] = 'double';
        break;

      case 'single':
      case 'thick':
        style['text-decoration'] = 'underline';
        break;

      case 'wave':
      case 'wavyDouble':
      case 'wavyHeavy':
        style['text-decoration-style'] = 'wavy';
        break;

      case 'words':
        style['text-decoration'] = 'underline';
        break;

      case 'none':
        style['text-decoration'] = 'none';
        break;
      default: break;
    }

    const col = xmlUtil.colorAttr(node, 'color');

    if (col) { style['text-decoration-color'] = col; }
  }

  parseFont(node: Element, style: Record<string, string>) {
    const ascii = xml.attr(node, 'ascii');
    const asciiTheme = values.themeValue(node, 'asciiTheme');

    const fonts = [ ascii, asciiTheme ].filter(x => x).join(', ');

    if (fonts.length > 0) { style['font-family'] = fonts; }
  }

  parseIndentation(node: Element, style: Record<string, string>) {
    const firstLine = xml.lengthAttr(node, 'firstLine');
    const hanging = xml.lengthAttr(node, 'hanging');
    const left = xml.lengthAttr(node, 'left');
    const start = xml.lengthAttr(node, 'start');
    const right = xml.lengthAttr(node, 'right');
    const end = xml.lengthAttr(node, 'end');

    if (firstLine) style['text-indent'] = firstLine;
    if (hanging) style['text-indent'] = `-${hanging}`;
    if (left || start) style['margin-left'] = left || start;
    if (right || end) style['margin-right'] = right || end;
  }

  parseSpacing(node: Element, style: Record<string, string>) {
    const before = xml.lengthAttr(node, 'before');
    const after = xml.lengthAttr(node, 'after');
    const line = xml.intAttr(node, 'line', undefined);
    const lineRule = xml.attr(node, 'lineRule');

    if (before) style['margin-top'] = before;
    if (after) style['margin-bottom'] = after;

    if (line !== null) {
      switch (lineRule) {
        case 'auto':
          style['line-height'] = `${(line / 240).toFixed(2)}`;
          break;

        case 'atLeast':
          style['line-height'] = `calc(100% + ${line / 20}pt)`;
          break;

        default:
          style['line-height'] = style['min-height'] = `${line / 20}pt`;
          break;
      }
    }
  }

  parseMarginProperties(node: Element, output: Record<string, string>) {
    xmlUtil.foreach(node, c => {
      switch (c.localName) {
        case 'left':
          output['padding-left'] = values.valueOfMargin(c);
          break;

        case 'right':
          output['padding-right'] = values.valueOfMargin(c);
          break;

        case 'top':
          output['padding-top'] = values.valueOfMargin(c);
          break;

        case 'bottom':
          output['padding-bottom'] = values.valueOfMargin(c);
          break;
        default: break;
      }
    });
  }

  parseTrHeight(node: Element, output: Record<string, string>) {
    switch (xml.attr(node, 'hRule')) {
      case 'exact':
        output.height = xml.lengthAttr(node, 'val');
        break;

      case 'atLeast':
      default:
        output.height = xml.lengthAttr(node, 'val');
        // min-height doesn't work for tr
        // output["min-height"] = xml.sizeAttr(node, "val");
        break;
    }
  }

  parseBorderProperties(node: Element, output: Record<string, string>) {
    xmlUtil.foreach(node, c => {
      switch (c.localName) {
        case 'start':
        case 'left':
          output['border-left'] = values.valueOfBorder(c);
          break;

        case 'end':
        case 'right':
          output['border-right'] = values.valueOfBorder(c);
          break;

        case 'top':
          output['border-top'] = values.valueOfBorder(c);
          break;

        case 'bottom':
          output['border-bottom'] = values.valueOfBorder(c);
          break;
        default: break;
      }
    });
  }
}

const knownColors = [ 'black', 'blue', 'cyan', 'darkBlue', 'darkCyan', 'darkGray', 'darkGreen', 'darkMagenta', 'darkRed', 'darkYellow', 'green', 'lightGray', 'magenta', 'none', 'red', 'white', 'yellow' ];

class xmlUtil {
  static foreach(node: Element, cb: (n: Element) => void) {
    for (let i = 0; i < node.childNodes.length; i++) {
      const n = node.childNodes[i];
      // 元素节点
      if (n.nodeType === 1) { cb(<Element>n); }
    }
  }

  static colorAttr(node: Element, attrName: string, defValue: string = null!, autoColor = 'black') {
    const v = xml.attr(node, attrName);

    if (v) {
      if (v === 'auto') {
        return autoColor;
      } else if (knownColors.includes(v)) {
        return v;
      }

      return `#${v}`;
    }

    const themeColor = xml.attr(node, 'themeColor');

    return themeColor ? `var(--docx-${themeColor}-color)` : defValue;
  }

  static sizeValue(node: Element, type: LengthUsageType = LengthUsage.Dxa) {
    return convertLength(node.textContent as string, type);
  }
}

class values {
  static themeValue(c: Element, attr: string) {
    const val = xml.attr(c, attr);
    return val ? `var(--docx-${val}-font)` : null;
  }

  static valueOfSize(c: Element, attr: string) {
    let type = LengthUsage.Dxa;

    switch (xml.attr(c, 'type')) {
      case 'dxa': break;
      case 'pct': type = LengthUsage.Percent; break;
      case 'auto': return 'auto';
      default: break;
    }

    return xml.lengthAttr(c, attr, type);
  }

  static valueOfMargin(c: Element) {
    return xml.lengthAttr(c, 'w');
  }

  static valueOfBorder(c: Element) {
    const type = xml.attr(c, 'val');

    if (type === 'nil') { return 'none'; }

    const color = xmlUtil.colorAttr(c, 'color');
    const size = xml.lengthAttr(c, 'sz', LengthUsage.Border);

    return `${size} solid ${color === 'auto' ? autos.borderColor : color}`;
  }

  static valueOfTblLayout(c: Element) {
    const type = xml.attr(c, 'val');
    return type === 'fixed' ? 'fixed' : 'auto';
  }

  static classNameOfCnfStyle(c: Element) {
    const val = xml.attr(c, 'val');
    const classes = [
      'first-row', 'last-row', 'first-col', 'last-col',
      'odd-col', 'even-col', 'odd-row', 'even-row',
      'ne-cell', 'nw-cell', 'se-cell', 'sw-cell',
    ];

    return classes.filter((_, i) => val[i] === '1').join(' ');
  }

  static valueOfJc(c: Element) {
    const type = xml.attr(c, 'val');

    switch (type) {
      case 'start':
      case 'left': return 'left';
      case 'center': return 'center';
      case 'end':
      case 'right': return 'right';
      case 'both': return 'justify';
      default: break;
    }

    return type;
  }

  static valueOfVertAlign(c: Element, asTagName = false) {
    const type = xml.attr(c, 'val');

    switch (type) {
      case 'subscript': return 'sub';
      case 'superscript': return asTagName ? 'sup' : 'super';
      default: break;
    }

    return asTagName ? null : type;
  }

  static valueOfTextAlignment(c: Element) {
    const type = xml.attr(c, 'val');

    switch (type) {
      case 'auto':
      case 'baseline': return 'baseline';
      case 'top': return 'top';
      case 'center': return 'middle';
      case 'bottom': return 'bottom';
      default: break;
    }

    return type;
  }

  static addSize(a: string, b: string): string {
    if (a == null) return b;
    if (b == null) return a;

    return `calc(${a} + ${b})`; // TODO
  }

  static classNameOftblLook(c: Element) {
    const val = xml.hexAttr(c, 'val', 0);
    let className = '';

    if (xml.boolAttr(c, 'firstRow') || (val & 0x0020)) className += ' first-row';
    if (xml.boolAttr(c, 'lastRow') || (val & 0x0040)) className += ' last-row';
    if (xml.boolAttr(c, 'firstColumn') || (val & 0x0080)) className += ' first-col';
    if (xml.boolAttr(c, 'lastColumn') || (val & 0x0100)) className += ' last-col';
    if (xml.boolAttr(c, 'noHBand') || (val & 0x0200)) className += ' no-hband';
    if (xml.boolAttr(c, 'noVBand') || (val & 0x0400)) className += ' no-vband';

    return className.trim();
  }
}

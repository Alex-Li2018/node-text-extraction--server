// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportWordParse from '../../../app/service/wordParse';
import ExportTextParseDocumentParser from '../../../app/service/text-parse/document-parser';
import ExportTextParseDocxParse from '../../../app/service/text-parse/docx-parse';
import ExportTextParseFormatParentWordData from '../../../app/service/text-parse/formatParentWordData';
import ExportTextParseUtils from '../../../app/service/text-parse/utils';
import ExportTextParseWordDocument from '../../../app/service/text-parse/word-document';
import ExportTextParseCommonOpenXmlPackage from '../../../app/service/text-parse/common/open-xml-package';
import ExportTextParseCommonPart from '../../../app/service/text-parse/common/part';
import ExportTextParseCommonRelationship from '../../../app/service/text-parse/common/relationship';
import ExportTextParseDocumentBookmarks from '../../../app/service/text-parse/document/bookmarks';
import ExportTextParseDocumentBorder from '../../../app/service/text-parse/document/border';
import ExportTextParseDocumentCommon from '../../../app/service/text-parse/document/common';
import ExportTextParseDocumentDocumentPart from '../../../app/service/text-parse/document/document-part';
import ExportTextParseDocumentDocument from '../../../app/service/text-parse/document/document';
import ExportTextParseDocumentDom from '../../../app/service/text-parse/document/dom';
import ExportTextParseDocumentFields from '../../../app/service/text-parse/document/fields';
import ExportTextParseDocumentLineSpacing from '../../../app/service/text-parse/document/line-spacing';
import ExportTextParseDocumentParagraph from '../../../app/service/text-parse/document/paragraph';
import ExportTextParseDocumentRun from '../../../app/service/text-parse/document/run';
import ExportTextParseDocumentSection from '../../../app/service/text-parse/document/section';
import ExportTextParseDocumentStyle from '../../../app/service/text-parse/document/style';
import ExportTextParseDocumentVector from '../../../app/service/text-parse/document/vector';
import ExportTextParseDocumentPropsCorePropsPart from '../../../app/service/text-parse/document-props/core-props-part';
import ExportTextParseDocumentPropsCoreProps from '../../../app/service/text-parse/document-props/core-props';
import ExportTextParseDocumentPropsCustomPropsPart from '../../../app/service/text-parse/document-props/custom-props-part';
import ExportTextParseDocumentPropsCustomProps from '../../../app/service/text-parse/document-props/custom-props';
import ExportTextParseDocumentPropsExtendedPropsPart from '../../../app/service/text-parse/document-props/extended-props-part';
import ExportTextParseDocumentPropsExtendedProps from '../../../app/service/text-parse/document-props/extended-props';
import ExportTextParseFontTableFontTable from '../../../app/service/text-parse/font-table/font-table';
import ExportTextParseFontTableFonts from '../../../app/service/text-parse/font-table/fonts';
import ExportTextParseHeaderFooterElements from '../../../app/service/text-parse/header-footer/elements';
import ExportTextParseHeaderFooterParts from '../../../app/service/text-parse/header-footer/parts';
import ExportTextParseNotesElements from '../../../app/service/text-parse/notes/elements';
import ExportTextParseNotesParts from '../../../app/service/text-parse/notes/parts';
import ExportTextParseNumberingNumberingPart from '../../../app/service/text-parse/numbering/numbering-part';
import ExportTextParseNumberingNumbering from '../../../app/service/text-parse/numbering/numbering';
import ExportTextParseParserXmlParser from '../../../app/service/text-parse/parser/xml-parser';
import ExportTextParseSettingsSettingsPart from '../../../app/service/text-parse/settings/settings-part';
import ExportTextParseSettingsSettings from '../../../app/service/text-parse/settings/settings';
import ExportTextParseStylesStylesPart from '../../../app/service/text-parse/styles/styles-part';
import ExportTextParseThemeThemePart from '../../../app/service/text-parse/theme/theme-part';
import ExportTextParseThemeTheme from '../../../app/service/text-parse/theme/theme';

declare module 'egg' {
  interface IService {
    wordParse: AutoInstanceType<typeof ExportWordParse>;
    textParse: {
      documentParser: AutoInstanceType<typeof ExportTextParseDocumentParser>;
      docxParse: AutoInstanceType<typeof ExportTextParseDocxParse>;
      formatParentWordData: AutoInstanceType<typeof ExportTextParseFormatParentWordData>;
      utils: AutoInstanceType<typeof ExportTextParseUtils>;
      wordDocument: AutoInstanceType<typeof ExportTextParseWordDocument>;
      common: {
        openXmlPackage: AutoInstanceType<typeof ExportTextParseCommonOpenXmlPackage>;
        part: AutoInstanceType<typeof ExportTextParseCommonPart>;
        relationship: AutoInstanceType<typeof ExportTextParseCommonRelationship>;
      }
      document: {
        bookmarks: AutoInstanceType<typeof ExportTextParseDocumentBookmarks>;
        border: AutoInstanceType<typeof ExportTextParseDocumentBorder>;
        common: AutoInstanceType<typeof ExportTextParseDocumentCommon>;
        documentPart: AutoInstanceType<typeof ExportTextParseDocumentDocumentPart>;
        document: AutoInstanceType<typeof ExportTextParseDocumentDocument>;
        dom: AutoInstanceType<typeof ExportTextParseDocumentDom>;
        fields: AutoInstanceType<typeof ExportTextParseDocumentFields>;
        lineSpacing: AutoInstanceType<typeof ExportTextParseDocumentLineSpacing>;
        paragraph: AutoInstanceType<typeof ExportTextParseDocumentParagraph>;
        run: AutoInstanceType<typeof ExportTextParseDocumentRun>;
        section: AutoInstanceType<typeof ExportTextParseDocumentSection>;
        style: AutoInstanceType<typeof ExportTextParseDocumentStyle>;
        vector: AutoInstanceType<typeof ExportTextParseDocumentVector>;
      }
      documentProps: {
        corePropsPart: AutoInstanceType<typeof ExportTextParseDocumentPropsCorePropsPart>;
        coreProps: AutoInstanceType<typeof ExportTextParseDocumentPropsCoreProps>;
        customPropsPart: AutoInstanceType<typeof ExportTextParseDocumentPropsCustomPropsPart>;
        customProps: AutoInstanceType<typeof ExportTextParseDocumentPropsCustomProps>;
        extendedPropsPart: AutoInstanceType<typeof ExportTextParseDocumentPropsExtendedPropsPart>;
        extendedProps: AutoInstanceType<typeof ExportTextParseDocumentPropsExtendedProps>;
      }
      fontTable: {
        fontTable: AutoInstanceType<typeof ExportTextParseFontTableFontTable>;
        fonts: AutoInstanceType<typeof ExportTextParseFontTableFonts>;
      }
      headerFooter: {
        elements: AutoInstanceType<typeof ExportTextParseHeaderFooterElements>;
        parts: AutoInstanceType<typeof ExportTextParseHeaderFooterParts>;
      }
      notes: {
        elements: AutoInstanceType<typeof ExportTextParseNotesElements>;
        parts: AutoInstanceType<typeof ExportTextParseNotesParts>;
      }
      numbering: {
        numberingPart: AutoInstanceType<typeof ExportTextParseNumberingNumberingPart>;
        numbering: AutoInstanceType<typeof ExportTextParseNumberingNumbering>;
      }
      parser: {
        xmlParser: AutoInstanceType<typeof ExportTextParseParserXmlParser>;
      }
      settings: {
        settingsPart: AutoInstanceType<typeof ExportTextParseSettingsSettingsPart>;
        settings: AutoInstanceType<typeof ExportTextParseSettingsSettings>;
      }
      styles: {
        stylesPart: AutoInstanceType<typeof ExportTextParseStylesStylesPart>;
      }
      theme: {
        themePart: AutoInstanceType<typeof ExportTextParseThemeThemePart>;
        theme: AutoInstanceType<typeof ExportTextParseThemeTheme>;
      }
    }
  }
}

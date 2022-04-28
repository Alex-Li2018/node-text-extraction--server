// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportHome from '../../../app/service/home';
import ExportComponentsDocxExtractDocumentParser from '../../../app/service/components/docxExtract/document-parser';
import ExportComponentsDocxExtractHtmlRenderer from ../../../app/service/components/docxExtracter';
import ExportComponentsDocxExtractIndex from '../../../app/service/components/docxExtract/index';
import ExportComponentsDocxExtractJavascript from '../../../app/service/components/docxExtract/javascript';
import ExportComponentsDocxExtractUtils from '../../../app/service/components/docxExtract/utils';
import ExportComponentsDocxExtractWordDocument from '../../../app/service/components/docxExtract/word-document';
import ExportComponentsDocxExtractCommonOpenXmlPackage from '../../../app/service/components/docxExtract/common/open-xml-package';
import ExportComponentsDocxExtractCommonPart from '../../../app/service/components/docxExtract/common/part';
import ExportComponentsDocxExtractCommonRelationship from '../../../app/service/components/docxExtract/common/relationship';
import ExportComponentsDocxExtractDocumentBookmarks from '../../../app/service/components/docxExtract/document/bookmarks';
import ExportComponentsDocxExtractDocumentBorder from '../../../app/service/components/docxExtract/document/border';
import ExportComponentsDocxExtractDocumentCommon from '../../../app/service/components/docxExtract/document/common';
import ExportComponentsDocxExtractDocumentDocumentPart from '../../../app/service/components/docxExtract/document/document-part';
import ExportComponentsDocxExtractDocumentDocument from '../../../app/service/components/docxExtract/document/document';
import ExportComponentsDocxExtractDocumentDom from '../../../app/service/components/docxExtract/document/dom';
import ExportComponentsDocxExtractDocumentFields from '../../../app/service/components/docxExtract/document/fields';
import ExportComponentsDocxExtractDocumentLineSpacing from '../../../app/service/components/docxExtract/document/line-spacing';
import ExportComponentsDocxExtractDocumentParagraph from '../../../app/service/components/docxExtract/document/paragraph';
import ExportComponentsDocxExtractDocumentRun from '../../../app/service/components/docxExtract/document/run';
import ExportComponentsDocxExtractDocumentSection from '../../../app/service/components/docxExtract/document/section';
import ExportComponentsDocxExtractDocumentStyle from '../../../app/service/components/docxExtract/document/style';
import ExportComponentsDocxExtractDocumentVector from '../../../app/service/components/docxExtract/document/vector';
import ExportComponentsDocxExtractDocumentPropsCorePropsPart from '../../../app/service/components/docxExtract/document-props/core-props-part';
import ExportComponentsDocxExtractDocumentPropsCoreProps from '../../../app/service/components/docxExtract/document-props/core-props';
import ExportComponentsDocxExtractDocumentPropsCustomPropsPart from '../../../app/service/components/docxExtract/document-props/custom-props-part';
import ExportComponentsDocxExtractDocumentPropsCustomProps from '../../../app/service/components/docxExtract/document-props/custom-props';
import ExportComponentsDocxExtractDocumentPropsExtendedPropsPart from '../../../app/service/components/docxExtract/document-props/extended-props-part';
import ExportComponentsDocxExtractDocumentPropsExtendedProps from '../../../app/service/components/docxExtract/document-props/extended-props';
import ExportComponentsDocxExtractFontTableFontTable from '../../../app/service/components/docxExtract/font-table/font-table';
import ExportComponentsDocxExtractFontTableFonts from '../../../app/service/components/docxExtract/font-table/fonts';
import ExportComponentsDocxExtractHeaderFooterElements from '../../../app/service/components/docxExtract/header-footer/elements';
import ExportComponentsDocxExtractHeaderFooterParts from '../../../app/service/components/docxExtract/header-footer/parts';
import ExportComponentsDocxExtractNotesElements from '../../../app/service/components/docxExtract/notes/elements';
import ExportComponentsDocxExtractNotesParts from '../../../app/service/components/docxExtract/notes/parts';
import ExportComponentsDocxExtractNumberingNumberingPart from '../../../app/service/components/docxExtract/numbering/numbering-part';
import ExportComponentsDocxExtractNumberingNumbering from '../../../app/service/components/docxExtract/numbering/numbering';
import ExportComponentsDocxExtractParserXmlParser from '../../../app/service/components/docxExtract/parser/xml-parser';
import ExportComponentsDocxExtractSettingsSettingsPart from '../../../app/service/components/docxExtract/settings/settings-part';
import ExportComponentsDocxExtractSettingsSettings from '../../../app/service/components/docxExtract/settings/settings';
import ExportComponentsDocxExtractStylesStylesPart from '../../../app/service/components/docxExtract/styles/styles-part';
import ExportComponentsDocxExtractThemeThemePart from '../../../app/service/components/docxExtract/theme/theme-part';
import ExportComponentsDocxExtractThemeTheme from '../../../app/service/components/docxExtract/theme/theme';

declare module 'egg' {
  interface IService {
    home: AutoInstanceType<typeof ExportHome>;
    components: {
      docxExtract: {
        documentParser: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentParser>;
        htmlRenderer: AutoInstanceType<typeof ExportComponentsDocxExtractHtmlRenderer>;
        index: AutoInstanceType<typeof ExportComponentsDocxExtractIndex>;
        javascript: AutoInstanceType<typeof ExportComponentsDocxExtractJavascript>;
        utils: AutoInstanceType<typeof ExportComponentsDocxExtractUtils>;
        wordDocument: AutoInstanceType<typeof ExportComponentsDocxExtractWordDocument>;
        common: {
          openXmlPackage: AutoInstanceType<typeof ExportComponentsDocxExtractCommonOpenXmlPackage>;
          part: AutoInstanceType<typeof ExportComponentsDocxExtractCommonPart>;
          relationship: AutoInstanceType<typeof ExportComponentsDocxExtractCommonRelationship>;
        }
        document: {
          bookmarks: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentBookmarks>;
          border: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentBorder>;
          common: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentCommon>;
          documentPart: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentDocumentPart>;
          document: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentDocument>;
          dom: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentDom>;
          fields: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentFields>;
          lineSpacing: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentLineSpacing>;
          paragraph: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentParagraph>;
          run: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentRun>;
          section: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentSection>;
          style: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentStyle>;
          vector: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentVector>;
        }
        documentProps: {
          corePropsPart: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentPropsCorePropsPart>;
          coreProps: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentPropsCoreProps>;
          customPropsPart: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentPropsCustomPropsPart>;
          customProps: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentPropsCustomProps>;
          extendedPropsPart: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentPropsExtendedPropsPart>;
          extendedProps: AutoInstanceType<typeof ExportComponentsDocxExtractDocumentPropsExtendedProps>;
        }
        fontTable: {
          fontTable: AutoInstanceType<typeof ExportComponentsDocxExtractFontTableFontTable>;
          fonts: AutoInstanceType<typeof ExportComponentsDocxExtractFontTableFonts>;
        }
        headerFooter: {
          elements: AutoInstanceType<typeof ExportComponentsDocxExtractHeaderFooterElements>;
          parts: AutoInstanceType<typeof ExportComponentsDocxExtractHeaderFooterParts>;
        }
        notes: {
          elements: AutoInstanceType<typeof ExportComponentsDocxExtractNotesElements>;
          parts: AutoInstanceType<typeof ExportComponentsDocxExtractNotesParts>;
        }
        numbering: {
          numberingPart: AutoInstanceType<typeof ExportComponentsDocxExtractNumberingNumberingPart>;
          numbering: AutoInstanceType<typeof ExportComponentsDocxExtractNumberingNumbering>;
        }
        parser: {
          xmlParser: AutoInstanceType<typeof ExportComponentsDocxExtractParserXmlParser>;
        }
        settings: {
          settingsPart: AutoInstanceType<typeof ExportComponentsDocxExtractSettingsSettingsPart>;
          settings: AutoInstanceType<typeof ExportComponentsDocxExtractSettingsSettings>;
        }
        styles: {
          stylesPart: AutoInstanceType<typeof ExportComponentsDocxExtractStylesStylesPart>;
        }
        theme: {
          themePart: AutoInstanceType<typeof ExportComponentsDocxExtractThemeThemePart>;
          theme: AutoInstanceType<typeof ExportComponentsDocxExtractThemeTheme>;
        }
      }
    }
  }
}

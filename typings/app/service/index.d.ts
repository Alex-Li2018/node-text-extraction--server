// This file is created by egg-ts-helper@1.30.3
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportHome from '../../../app/service/home';
import ExportComponentsDocExtractIndex from '../../../app/service/components/docExtract/index';
import ExportComponentsDocExtractWordDocument from '../../../app/service/components/docExtract/wordDocument';
import ExportComponentsDocxExtractCopyDocumentParser from '../../../app/service/components/docxExtractCopy/document-parser';
import ExportComponentsDocxExtractCopyDocxExtract from '../../../app/service/components/docxExtractCopy/docxExtract';
import ExportComponentsDocxExtractCopyHtmlRenderer from '../../../app/service/components/docxExtractCopy/html-renderer';
import ExportComponentsDocxExtractCopyJavascript from '../../../app/service/components/docxExtractCopy/javascript';
import ExportComponentsDocxExtractCopyUtils from '../../../app/service/components/docxExtractCopy/utils';
import ExportComponentsDocxExtractCopyWordDocument from '../../../app/service/components/docxExtractCopy/word-document';
import ExportComponentsDocExtractDocumentCommon from '../../../app/service/components/docExtract/document/common';
import ExportComponentsDocExtractUtilsIndex from '../../../app/service/components/docExtract/utils/index';
import ExportComponentsDocExtractXmlOpenXmlPackage from '../../../app/service/components/docExtract/xml/openXmlPackage';
import ExportComponentsDocExtractXmlRelationship from '../../../app/service/components/docExtract/xml/relationship';
import ExportComponentsDocxExtractCopyCommonOpenXmlPackage from '../../../app/service/components/docxExtractCopy/common/open-xml-package';
import ExportComponentsDocxExtractCopyCommonPart from '../../../app/service/components/docxExtractCopy/common/part';
import ExportComponentsDocxExtractCopyCommonRelationship from '../../../app/service/components/docxExtractCopy/common/relationship';
import ExportComponentsDocxExtractCopyDocumentBookmarks from '../../../app/service/components/docxExtractCopy/document/bookmarks';
import ExportComponentsDocxExtractCopyDocumentBorder from '../../../app/service/components/docxExtractCopy/document/border';
import ExportComponentsDocxExtractCopyDocumentCommon from '../../../app/service/components/docxExtractCopy/document/common';
import ExportComponentsDocxExtractCopyDocumentDocumentPart from '../../../app/service/components/docxExtractCopy/document/document-part';
import ExportComponentsDocxExtractCopyDocumentDocument from '../../../app/service/components/docxExtractCopy/document/document';
import ExportComponentsDocxExtractCopyDocumentDom from '../../../app/service/components/docxExtractCopy/document/dom';
import ExportComponentsDocxExtractCopyDocumentFields from '../../../app/service/components/docxExtractCopy/document/fields';
import ExportComponentsDocxExtractCopyDocumentLineSpacing from '../../../app/service/components/docxExtractCopy/document/line-spacing';
import ExportComponentsDocxExtractCopyDocumentParagraph from '../../../app/service/components/docxExtractCopy/document/paragraph';
import ExportComponentsDocxExtractCopyDocumentRun from '../../../app/service/components/docxExtractCopy/document/run';
import ExportComponentsDocxExtractCopyDocumentSection from '../../../app/service/components/docxExtractCopy/document/section';
import ExportComponentsDocxExtractCopyDocumentStyle from '../../../app/service/components/docxExtractCopy/document/style';
import ExportComponentsDocxExtractCopyDocumentVector from '../../../app/service/components/docxExtractCopy/document/vector';
import ExportComponentsDocxExtractCopyDocumentPropsCorePropsPart from '../../../app/service/components/docxExtractCopy/document-props/core-props-part';
import ExportComponentsDocxExtractCopyDocumentPropsCoreProps from '../../../app/service/components/docxExtractCopy/document-props/core-props';
import ExportComponentsDocxExtractCopyDocumentPropsCustomPropsPart from '../../../app/service/components/docxExtractCopy/document-props/custom-props-part';
import ExportComponentsDocxExtractCopyDocumentPropsCustomProps from '../../../app/service/components/docxExtractCopy/document-props/custom-props';
import ExportComponentsDocxExtractCopyDocumentPropsExtendedPropsPart from '../../../app/service/components/docxExtractCopy/document-props/extended-props-part';
import ExportComponentsDocxExtractCopyDocumentPropsExtendedProps from '../../../app/service/components/docxExtractCopy/document-props/extended-props';
import ExportComponentsDocxExtractCopyFontTableFontTable from '../../../app/service/components/docxExtractCopy/font-table/font-table';
import ExportComponentsDocxExtractCopyFontTableFonts from '../../../app/service/components/docxExtractCopy/font-table/fonts';
import ExportComponentsDocxExtractCopyHeaderFooterElements from '../../../app/service/components/docxExtractCopy/header-footer/elements';
import ExportComponentsDocxExtractCopyHeaderFooterParts from '../../../app/service/components/docxExtractCopy/header-footer/parts';
import ExportComponentsDocxExtractCopyNotesElements from '../../../app/service/components/docxExtractCopy/notes/elements';
import ExportComponentsDocxExtractCopyNotesParts from '../../../app/service/components/docxExtractCopy/notes/parts';
import ExportComponentsDocxExtractCopyNumberingNumberingPart from '../../../app/service/components/docxExtractCopy/numbering/numbering-part';
import ExportComponentsDocxExtractCopyNumberingNumbering from '../../../app/service/components/docxExtractCopy/numbering/numbering';
import ExportComponentsDocxExtractCopyParserXmlParser from '../../../app/service/components/docxExtractCopy/parser/xml-parser';
import ExportComponentsDocxExtractCopySettingsSettingsPart from '../../../app/service/components/docxExtractCopy/settings/settings-part';
import ExportComponentsDocxExtractCopySettingsSettings from '../../../app/service/components/docxExtractCopy/settings/settings';
import ExportComponentsDocxExtractCopyStylesStylesPart from '../../../app/service/components/docxExtractCopy/styles/styles-part';
import ExportComponentsDocxExtractCopyThemeThemePart from '../../../app/service/components/docxExtractCopy/theme/theme-part';
import ExportComponentsDocxExtractCopyThemeTheme from '../../../app/service/components/docxExtractCopy/theme/theme';
import ExportComponentsDocExtractXmlParseXmlParser from '../../../app/service/components/docExtract/xml/parse/xmlParser';

declare module 'egg' {
  interface IService {
    home: AutoInstanceType<typeof ExportHome>;
    components: {
      docExtract: {
        index: AutoInstanceType<typeof ExportComponentsDocExtractIndex>;
        wordDocument: AutoInstanceType<typeof ExportComponentsDocExtractWordDocument>;
        document: {
          common: AutoInstanceType<typeof ExportComponentsDocExtractDocumentCommon>;
        }
        utils: {
          index: AutoInstanceType<typeof ExportComponentsDocExtractUtilsIndex>;
        }
        xml: {
          openXmlPackage: AutoInstanceType<typeof ExportComponentsDocExtractXmlOpenXmlPackage>;
          relationship: AutoInstanceType<typeof ExportComponentsDocExtractXmlRelationship>;
          parse: {
            xmlParser: AutoInstanceType<typeof ExportComponentsDocExtractXmlParseXmlParser>;
          }
        }
      }
      docxExtractCopy: {
        documentParser: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentParser>;
        docxExtract: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocxExtract>;
        htmlRenderer: AutoInstanceType<typeof ExportComponentsDocxExtractCopyHtmlRenderer>;
        javascript: AutoInstanceType<typeof ExportComponentsDocxExtractCopyJavascript>;
        utils: AutoInstanceType<typeof ExportComponentsDocxExtractCopyUtils>;
        wordDocument: AutoInstanceType<typeof ExportComponentsDocxExtractCopyWordDocument>;
        common: {
          openXmlPackage: AutoInstanceType<typeof ExportComponentsDocxExtractCopyCommonOpenXmlPackage>;
          part: AutoInstanceType<typeof ExportComponentsDocxExtractCopyCommonPart>;
          relationship: AutoInstanceType<typeof ExportComponentsDocxExtractCopyCommonRelationship>;
        }
        document: {
          bookmarks: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentBookmarks>;
          border: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentBorder>;
          common: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentCommon>;
          documentPart: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentDocumentPart>;
          document: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentDocument>;
          dom: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentDom>;
          fields: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentFields>;
          lineSpacing: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentLineSpacing>;
          paragraph: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentParagraph>;
          run: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentRun>;
          section: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentSection>;
          style: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentStyle>;
          vector: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentVector>;
        }
        documentProps: {
          corePropsPart: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentPropsCorePropsPart>;
          coreProps: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentPropsCoreProps>;
          customPropsPart: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentPropsCustomPropsPart>;
          customProps: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentPropsCustomProps>;
          extendedPropsPart: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentPropsExtendedPropsPart>;
          extendedProps: AutoInstanceType<typeof ExportComponentsDocxExtractCopyDocumentPropsExtendedProps>;
        }
        fontTable: {
          fontTable: AutoInstanceType<typeof ExportComponentsDocxExtractCopyFontTableFontTable>;
          fonts: AutoInstanceType<typeof ExportComponentsDocxExtractCopyFontTableFonts>;
        }
        headerFooter: {
          elements: AutoInstanceType<typeof ExportComponentsDocxExtractCopyHeaderFooterElements>;
          parts: AutoInstanceType<typeof ExportComponentsDocxExtractCopyHeaderFooterParts>;
        }
        notes: {
          elements: AutoInstanceType<typeof ExportComponentsDocxExtractCopyNotesElements>;
          parts: AutoInstanceType<typeof ExportComponentsDocxExtractCopyNotesParts>;
        }
        numbering: {
          numberingPart: AutoInstanceType<typeof ExportComponentsDocxExtractCopyNumberingNumberingPart>;
          numbering: AutoInstanceType<typeof ExportComponentsDocxExtractCopyNumberingNumbering>;
        }
        parser: {
          xmlParser: AutoInstanceType<typeof ExportComponentsDocxExtractCopyParserXmlParser>;
        }
        settings: {
          settingsPart: AutoInstanceType<typeof ExportComponentsDocxExtractCopySettingsSettingsPart>;
          settings: AutoInstanceType<typeof ExportComponentsDocxExtractCopySettingsSettings>;
        }
        styles: {
          stylesPart: AutoInstanceType<typeof ExportComponentsDocxExtractCopyStylesStylesPart>;
        }
        theme: {
          themePart: AutoInstanceType<typeof ExportComponentsDocxExtractCopyThemeThemePart>;
          theme: AutoInstanceType<typeof ExportComponentsDocxExtractCopyThemeTheme>;
        }
      }
    }
  }
}

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
import ExportComponentsDocExtractDocumentCommon from '../../../app/service/components/docExtract/document/common';
import ExportComponentsDocExtractUtilsIndex from '../../../app/service/components/docExtract/utils/index';
import ExportComponentsDocExtractXmlOpenXmlPackage from '../../../app/service/components/docExtract/xml/openXmlPackage';
import ExportComponentsDocExtractXmlRelationship from '../../../app/service/components/docExtract/xml/relationship';
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
    }
  }
}

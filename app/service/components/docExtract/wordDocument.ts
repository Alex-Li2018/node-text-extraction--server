import { OpenXmlPackage } from './xml/openXmlPackage';

export class WordDocument {

  static load(blob: Blob | any, options: any) :Promise<any> {
    return OpenXmlPackage.load(blob, options)
      .then(res => {
        console.log(res);
      });
  }
}

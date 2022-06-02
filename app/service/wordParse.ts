import { Service } from 'egg';
import { praseAsync } from './text-extraction/docx-parse';
import * as fs from 'fs';

class WordParseService extends Service {
  // 解析word
  async parse(filePath) {
    return new Promise((resolve, reject) => {
      praseAsync(fs.readFileSync(filePath), { trimXmlDeclaration: true })
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export default WordParseService;

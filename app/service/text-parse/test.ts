import { praseAsync } from './docx-parse';
import * as fs from 'fs';
import * as path from 'path';

praseAsync(fs.readFileSync(path.resolve(__dirname, './test.docx')), {}).then(res => {
  console.log(res);
});

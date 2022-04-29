import { Service } from 'egg';
import { praseAsync } from './components/docExtract';

/**
 * Test Service
 */
export default class Test extends Service {

  /**
   * extract解析docx
   * @param file
   * @param options
   */
  public async docxExtract(file, options) {
    await praseAsync(file, options);
  }
}

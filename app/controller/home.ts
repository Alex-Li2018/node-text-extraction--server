import Controller from '../core/baseController';
import * as fs from 'fs';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    let result;
    try {
      // 处理文件
      result = await ctx.service.wordParse.parse(file.filepath);
    } finally {
      // 需要删除临时文件
      await fs.unlinkSync(file.filepath);
    }

    this.success(result, 'ok');
  }

  public async htmlParse() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    let result;
    try {
      // 处理文件
      result = await ctx.service.htmlParse.parse(file.filepath);
    } finally {
      // 需要删除临时文件
      await fs.unlinkSync(file.filepath);
    }

    this.success(result, 'ok');
  }
}

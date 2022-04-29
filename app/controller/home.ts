const Controller = require('../core/baseController');

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    console.log('got %d files', ctx.request.files.length);

    // 只能上传一个文件
    if (ctx.request.files.length) {
      this.success('文件只能上传一个', 400);
    }

    try {
      // 遍历处理多个文件
      for (const file of ctx.request.files) {
        console.log('field: ' + file.fieldname);
        console.log('filename: ' + file.filename);
        console.log('encoding: ' + file.encoding);
        console.log('mime: ' + file.mime);
        console.log('tmp filepath: ' + file.filepath);

        await ctx.service.home.docxExtract(file, {});
      }
    } finally {
      // 需要删除临时文件
      await ctx.cleanupRequestFiles();
    }
    this.success({}, 'ok');
  }
}

import Controller from '../core/baseController';
// 消费流，将流消费到虫洞
import sendToWormhole from 'stream-wormhole';

function toArrayBuffer(buf) {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

function streamToArrayBuffer(stream, mimeType?:string) {
  if (mimeType != null && typeof mimeType !== 'string') {
    throw new Error('Invalid mimetype, expected string.');
  }
  return new Promise((resolve, reject) => {
    const chunks: Array<any> = [];
    stream
      .on('data', chunk => chunks.concat(toArrayBuffer(chunk)))
      .once('end', () => {
        resolve(chunks);
      })
      .once('error', reject);
  });
}

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    const stream = await ctx.getFileStream();
    const blob = await streamToArrayBuffer(stream);

    try {
      await ctx.service.home.docxExtract(blob);
    } finally {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
    }
    this.success({}, 'ok');
  }
}

import { Service } from 'egg';
import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cheerio = require('cheerio');

function traverseDomTree(parentNode) {
  // 广度优先 非递归实现
  const layer: Array<any> = [];
  const domArr: Array<any> = [];
  let i = 1;

  // 节点深度从父节点开始算起
  layer.push(parentNode);
  domArr.push({
    id: 1,
    pid: 0,
    nodeName: parentNode.nodeName,
  });
  i += 1;

  while (layer.length !== 0) {
    // 出队
    const root = layer.shift();

    if (root.children && root.children.length > 0) {
      // eslint-disable-next-line no-loop-func
      layer.push(...Array.from(root.children));
      root.id = i;
      domArr.push({
        id: i,
        pid: root.parent && root.parent.id ? root.parent.id : 1,
        nodeName: root.name || root.type,
        attr: root.attribs || null,
      });

      i += 1;
    } else {

      root.id = i;
      domArr.push({
        id: i,
        pid: root.parent.id,
        nodeName: root.name || root.type,
        attr: root.attribs || null,
        data: root.type === 'text' ? root.data : null,
      });

      i += 1;
    }
  }

  return domArr;
}

function arrayToTree(arr, rootId) {
  return arr.filter(item => item.pid === rootId)
    .map(item => ({
      ...item,
      children: arrayToTree(arr, item.id),
    }));
}

class HtmlParseService extends Service {
  // 解析word
  async parse(filePath) {
    const res = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(res);

    const obj = {
      nodeName: 'body',
      attr: null,
      children: $('body').children(),
    };
    const domArr = traverseDomTree(obj);

    return arrayToTree(domArr, 0);
  }
}

export default HtmlParseService;

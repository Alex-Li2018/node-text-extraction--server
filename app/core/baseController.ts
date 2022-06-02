import { Controller } from 'egg';

/**
 * 定义http状态码
 * @type {number}
 */

enum STATUS_CODE {
  // 成功
  SUCCESS = 200,
  // token为空
  ERROR_TOKEN_EMPTY = 2030,
  // token无效
  ERROR_TOKEN_INVALID = 2040,
  // 错误
  ERROR_STATUS = 400,
  // 未找到
  ERROR_NOT_FOUND = 404,
}

class BaseController extends Controller {

  success(data, msg) {
    this.ctx.body = {
      code: STATUS_CODE.SUCCESS,
      data,
      msg,
    };
  }

  error(data, msg) {
    this.ctx.body = {
      code: STATUS_CODE.ERROR_STATUS,
      data,
      msg,
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(STATUS_CODE.ERROR_NOT_FOUND, msg);
  }
}

export default BaseController;

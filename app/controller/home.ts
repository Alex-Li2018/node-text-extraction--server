import Controller from '../core/baseController';

export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    console.log(ctx);
    this.success({}, 'ok');
  }
}

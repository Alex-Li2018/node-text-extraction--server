import { Application } from 'egg';

export default (app: Application) => {
  const { controller } = app;

  // 设置命名空间
  const apiV1Router = app.router.namespace('/api/v1');


  apiV1Router.post('/docx-parser', controller.home.index);
};

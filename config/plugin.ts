import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
};

export default plugin;

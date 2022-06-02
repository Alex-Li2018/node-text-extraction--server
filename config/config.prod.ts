import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.cluster = {
    listen: {
      // 端口
      port: 5000,
      // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
      hostname: '0.0.0.0',
      // path: '/var/run/egg.sock',
    },
  };
  return config;
};

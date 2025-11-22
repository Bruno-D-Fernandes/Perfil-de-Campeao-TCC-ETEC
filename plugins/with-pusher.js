module.exports = function withPusher(config) {
  return {
    ...config,
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        NSAllowsArbitraryLoads: true,
      },
    },
  };
};

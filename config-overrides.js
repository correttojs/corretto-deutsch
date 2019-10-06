/* eslint-disable @typescript-eslint/no-var-requires */
const { rewireWorkboxInject, defaultInjectConfig } = require('react-app-rewire-workbox');
const path = require('path');

module.exports = function override(config, env) {
  if (env === 'production') {
    console.log('Production build - Adding Workbox for PWAs');
    // Extend the default injection config with required swSrc
    delete config.plugins.InjectManifest;
    const workboxConfig = {
      ...defaultInjectConfig,
      exclude: [
        /\.map$/,
        /^service-worker.js$/,
        /^(?:asset-)manifest.*\.js(?:on)?$/,
        /^precache-manifest.*\.js(?:on)?$/,
      ],
      swSrc: path.join(__dirname, 'src', 'sw.js'),
    };

    config = rewireWorkboxInject(workboxConfig)(config, env);
  }

  return config;
};

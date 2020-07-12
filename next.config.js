const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withSourceMaps = require('@zeit/next-source-maps');

module.exports = withSourceMaps()({
  webpack: (config, options) => {
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }

    if (process.env.SENTRY_DSN) {
      config.plugins.push(
        new SentryWebpackPlugin({
          release: process.env.RELEASE_VERSION,
          include: '.next',
          ignore: ['node_modules'],
          urlPrefix: '~/_next',
        }),
      );
    }

    return config;
  },
});

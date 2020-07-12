const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withSourceMaps = require('@zeit/next-source-maps');

module.exports = withSourceMaps({
  env: {
    RELEASE_VERSION: process.env.RELEASE_VERSION,
    SERVER_API_URL: process.env.SERVER_API_URL,
    CLIENT_API_URL: process.env.CLIENT_API_URL,
    PUBLIC_URL: process.env.PUBLIC_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    YM_ACCOUNT_ID: process.env.YM_ACCOUNT_ID,
  },
  webpack(config, options) {
    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser';
    }

    if (process.env.SENTRY_DSN) {
      config.plugins.push(
        new SentryWebpackPlugin({
          release: process.env.RELEASE_VERSION,
          include: '.next',
          ignore: ['node_modules', 'cypress', 'test'],
          urlPrefix: '~/_next',
        }),
      );
    }

    return config;
  },
});

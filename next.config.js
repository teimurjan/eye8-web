const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withSourceMaps = require('@zeit/next-source-maps');

module.exports = withBundleAnalyzer(
  withSourceMaps()({
    env: {
      SENTRY_DSN: process.env.SENTRY_DSN,
      SENTRY_ORG: process.env.SENTRY_ORG,
      SENTRY_PROJECT: process.env.SENTRY_PROJECT,
      SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
      NODE_ENV: process.env.NODE_ENV,
      RELEASE_VERSION: process.env.RELEASE_VERSION,
      PUBLIC_URL: process.env.PUBLIC_URL,
      CLIENT_API_URL: process.env.CLIENT_API_URL,
      YM_ACCOUNT_ID: process.env.YM_ACCOUNT_ID,
    },
    webpack: (config, options) => {
      if (!options.isServer) {
        config.resolve.alias['@sentry/node'] = '@sentry/browser';
      }

      if (
        process.env.SENTRY_DSN &&
        process.env.SENTRY_ORG &&
        process.env.SENTRY_PROJECT &&
        process.env.SENTRY_AUTH_TOKEN &&
        process.env.NODE_ENV === 'production'
      ) {
        config.plugins.push(
          new SentryWebpackPlugin({
            include: '.next',
            ignore: ['node_modules'],
            urlPrefix: '~/_next',
            release: process.env.RELEASE_VERSION,
          }),
        );
      }

      return config;
    },
  }),
);

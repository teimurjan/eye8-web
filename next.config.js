const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withSourceMaps = require('@zeit/next-source-maps');
const withManifest = require('next-manifest');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA(
  withManifest(
    withBundleAnalyzer(
      withSourceMaps()({
        env: {
          SENTRY_DSN: process.env.SENTRY_DSN,
          SENTRY_ORG: process.env.SENTRY_ORG,
          SENTRY_PROJECT: process.env.SENTRY_PROJECT,
          SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
          RELEASE_VERSION: process.env.RELEASE_VERSION,
          PUBLIC_URL: process.env.PUBLIC_URL,
          CLIENT_API_URL: process.env.CLIENT_API_URL,
          YM_ACCOUNT_ID: process.env.YM_ACCOUNT_ID,
          FB_PIXEL_ID: process.env.FB_PIXEL_ID,
          FACEBOOK_CLIENT_ACCESS_TOKEN: process.env.FACEBOOK_CLIENT_ACCESS_TOKEN,
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

          config.module.rules.push({
            test: /\.svg$/,
            issuer: {
              test: /\.(js|ts)x?$/,
            },
            use: ['@svgr/webpack'],
          });

          return config;
        },
        pwa: {
          disable: process.env.DISABLE_SW === 'true',
          dest: 'public',
          runtimeCaching,
        },
        manifest: {
          output: './public',
          name: 'Eye8',
          short_name: 'Eye8',
          theme_color: '#fff',
          background_color: '#fff',
          display: 'browser',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'img/icons/icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
            },
            {
              src: 'img/icons/icon-96x96.png',
              sizes: '96x96',
              type: 'image/png',
            },
            {
              src: 'img/icons/icon-128x128.png',
              sizes: '128x128',
              type: 'image/png',
            },
            {
              src: 'img/icons/icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
            },
            {
              src: 'img/icons/icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
            },
            {
              src: 'img/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'img/icons/icon-384x384.png',
              sizes: '384x384',
              type: 'image/png',
            },
            {
              src: 'img/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
          splash_pages: null,
        },
      }),
    ),
  ),
);

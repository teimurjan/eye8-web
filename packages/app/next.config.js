const fs = require('fs');
const path = require('path');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const withSourceMaps = require('@zeit/next-source-maps');
const withManifest = require('next-manifest');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const { resolveTsAliases } = require('resolve-ts-aliases');

const generateRobotsTxt = () =>
  fs.writeFileSync(
    path.resolve('./public/robots.txt'),
    `User-agent: *\nSitemap: ${process.env.PUBLIC_URL}/sitemap.xml`,
  );

const workspace = path.join(__dirname, '..');

const env = {
  SENTRY_DSN: process.env.SENTRY_DSN,
  SENTRY_ORG: process.env.SENTRY_ORG,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
  RELEASE_VERSION: process.env.RELEASE_VERSION,
  PUBLIC_URL: process.env.PUBLIC_URL,
  CLIENT_API_URL: process.env.CLIENT_API_URL,
  YM_ACCOUNT_ID: process.env.YM_ACCOUNT_ID,
  FB_CLIENT_ACCESS_TOKEN: process.env.FB_CLIENT_ACCESS_TOKEN,
  SHOP_NAME: process.env.SHOP_NAME,
  SERVER_API_URL: process.env.SERVER_API_URL,
  INSTAGRAM_URL: process.env.INSTAGRAM_URL,
  TIKTOK_URL: process.env.TIKTOK_URL,
};

module.exports = withPWA(
  withManifest(
    withBundleAnalyzer(
      withSourceMaps()({
        env,
        webpack: (config, options) => {
          /** Allows import modules from packages in workspace. */
          config.module = {
            ...config.module,
            rules: [
              ...config.module.rules,
              {
                test: /\.(js|jsx|ts|tsx)$/,
                include: [workspace],
                exclude: /node_modules/,
                use: options.defaultLoaders.babel,
              },
            ],
          };

          const tsConfigPath = path.join(path.resolve(__dirname), '../../tsconfig.json');
          const tsConfigAliases = resolveTsAliases(tsConfigPath);
          config.resolve.alias = { ...config.resolve.alias, ...tsConfigAliases };

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

          generateRobotsTxt();

          return config;
        },
        pwa: {
          disable: process.env.DISABLE_SW === 'true',
          dest: 'public',
          runtimeCaching,
        },
        manifest: {
          output: path.resolve('./public'),
          name: process.env.SHOP_NAME,
          short_name: process.env.SHOP_NAME,
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

const withSourceMaps = require('@zeit/next-source-maps');

module.exports = withSourceMaps({
  env: {
    SERVER_API_URL: process.env.SERVER_API_URL,
    CLIENT_API_URL: process.env.CLIENT_API_URL,
    PUBLIC_URL: process.env.PUBLIC_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    YM_ACCOUNT_ID: process.env.YM_ACCOUNT_ID,
  },
});

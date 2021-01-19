FROM node:12.14.0-alpine as builder
WORKDIR /app

RUN npm config set unsafe-perm true
RUN set http_proxy= && set https_proxy= && yarn config delete proxy && npm config rm https-proxy && npm config rm proxy
ENV PATH /app/node_modules/.bin:$PATH

RUN yarn add lerna -g

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY lerna.json /app/lerna.json
COPY packages/admin /app/packages/admin
COPY packages/admin-ui /app/packages/admin-ui
COPY packages/api /app/packages/api
COPY packages/app /app/packages/app
COPY packages/client /app/packages/client
COPY packages/client-ui /app/packages/client-ui
COPY packages/di /app/packages/di
COPY packages/manager /app/packages/manager
COPY packages/service /app/packages/service
COPY packages/shared /app/packages/shared
COPY packages/storage /app/packages/storage
RUN lerna bootstrap

COPY tsconfig.json /app/tsconfig.json
COPY @types /app/@types

ARG SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG YM_ACCOUNT_ID
ARG FB_PIXEL_ID
ARG FB_CLIENT_ACCESS_TOKEN
ARG RELEASE_VERSION
ARG PUBLIC_URL
ARG SERVER_API_URL
ARG SHOP_NAME
ARG INSTAGRAM_URL
ARG TIKTOK_URL

ENV _SENTRY_DSN="$SENTRY_DSN"
ENV _SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN"
ENV _SENTRY_ORG="$SENTRY_ORG"
ENV _SENTRY_PROJECT="$SENTRY_PROJECT"
ENV _YM_ACCOUNT_ID="$YM_ACCOUNT_ID"
ENV _FB_PIXEL_ID="$FB_PIXEL_ID"
ENV _FB_CLIENT_ACCESS_TOKEN="$FB_CLIENT_ACCESS_TOKEN"
ENV _RELEASE_VERSION="$RELEASE_VERSION"
ENV _PUBLIC_URL="$PUBLIC_URL"
ENV _SERVER_API_URL="$SERVER_API_URL"
ENV _SHOP_NAME="$SHOP_NAME"
ENV _INSTAGRAM_URL="$INSTAGRAM_URL"
ENV _TIKTOK_URL="$TIKTOK_URL"

RUN env \
  SENTRY_DSN="$_SENTRY_DSN" \
  SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN" \
  SENTRY_ORG="$SENTRY_ORG" \
  SENTRY_PROJECT="$SENTRY_PROJECT" \
  YM_ACCOUNT_ID="$_YM_ACCOUNT_ID" \
  FB_PIXEL_ID="$_FB_PIXEL_ID" \
  FB_CLIENT_ACCESS_TOKEN="$_FB_CLIENT_ACCESS_TOKEN" \
  RELEASE_VERSION="$_RELEASE_VERSION" \
  SERVER_API_URL="$_SERVER_API_URL" \
  PUBLIC_URL="$_PUBLIC_URL" \
  SHOP_NAME="$_SHOP_NAME" \
  INSTAGRAM_URL="$_INSTAGRAM_URL" \
  TIKTOK_URL="$_TIKTOK_URL" \
  lerna run --scope "@eye8/app" build --stream

EXPOSE 3000

CMD env \
  SENTRY_DSN="$_SENTRY_DSN" \
  SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN" \
  SENTRY_ORG="$SENTRY_ORG" \
  SENTRY_PROJECT="$SENTRY_PROJECT" \
  YM_ACCOUNT_ID="$_YM_ACCOUNT_ID" \
  FB_PIXEL_ID="$_FB_PIXEL_ID" \
  FB_CLIENT_ACCESS_TOKEN="$_FB_CLIENT_ACCESS_TOKEN" \
  RELEASE_VERSION="$_RELEASE_VERSION" \
  SERVER_API_URL="$_SERVER_API_URL" \
  PUBLIC_URL="$_PUBLIC_URL" \
  SHOP_NAME="$_SHOP_NAME" \
  INSTAGRAM_URL="$_INSTAGRAM_URL" \
  TIKTOK_URL="$_TIKTOK_URL" \
  lerna run --scope "@eye8/app" start:next --stream

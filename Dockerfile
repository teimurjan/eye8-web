FROM node:12.14.0-alpine as builder
WORKDIR /app
RUN npm config set unsafe-perm true
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN set http_proxy= && set https_proxy= && yarn config delete proxy && npm config rm https-proxy && npm config rm proxy
RUN yarn --network-timeout 1000000
COPY . /app
ARG SENTRY_DSN
ARG YM_ACCOUNT_ID
ENV _SENTRY_DSN $SENTRY_DSN
ENV _YM_ACCOUNT_ID $YM_ACCOUNT_ID
RUN env SENTRY_DSN=$_SENTRY_DSN YM_ACCOUNT_ID=$_YM_ACCOUNT_ID SERVER_API_URL=http://backend:8080 PUBLIC_URL=https://eye8.kg yarn build
EXPOSE 3000
CMD env SENTRY_DSN=$_SENTRY_DSN YM_ACCOUNT_ID=$_YM_ACCOUNT_ID SERVER_API_URL=http://backend:8080 PUBLIC_URL=https://eye8.kg yarn start

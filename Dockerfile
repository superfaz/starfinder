FROM node:18-alpine as builder

WORKDIR /source
COPY . .

RUN yarn
RUN yarn build:standalone

FROM node:18-alpine as runner

WORKDIR /code

COPY --from=builder /source/.next/standalone .
COPY --from=builder /source/.next/static ./.next/static
COPY --from=builder /source/public ./public

RUN yarn

EXPOSE 3000
ENTRYPOINT [ "node", "server.js" ]

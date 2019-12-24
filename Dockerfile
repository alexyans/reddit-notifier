FROM node:latest

WORKDIR /notifier
ADD . .

RUN yarn install

ENTRYPOINT ./scripts/up.sh

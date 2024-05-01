FROM node:lts-bullseye-slim as base

ENV NODE_ENV=production

WORKDIR /usr/src/api

RUN npm install -g pnpm
RUN npm install -g tsup
RUN npm install -g rimraf
RUN npm install -g typescript

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run prebuild
RUN pnpm run build

CMD [ "pnpm", "run", "prod" ]
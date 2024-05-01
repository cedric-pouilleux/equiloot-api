FROM node:lts-bullseye-slim as base

ARG PORT=4000

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/api

RUN npm install -g pnpm
RUN npm install -g tsup
RUN npm install -g rimraf
RUN npm install -g typescript

# Build
FROM base as build

COPY package*.json ./

RUN pnpm install

# Run
FROM base

COPY . .

RUN pnpm run prebuild
RUN pnpm run build

CMD [ "pnpm", "run", "prod" ]
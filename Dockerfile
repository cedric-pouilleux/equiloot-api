FROM node:lts-bullseye-slim as base

WORKDIR /usr/src/api

RUN npm install -g pnpm

# Build
FROM base as build

COPY package*.json ./

RUN pnpm install

# Run
FROM base

COPY . .

RUN pnpm run build

CMD [ "pnpm", "run", "prod" ]
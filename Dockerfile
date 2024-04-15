ARG NODE_VERSION=20.12.2

FROM node:${NODE_VERSION}-slim as base

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]

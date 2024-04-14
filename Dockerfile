ARG NODE_VERSION=20.12.2

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $PORT

CMD [ "npm", "start" ]

FROM node:20-alpine as base

ENV NODE_ENV production

WORKDIR /src

FROM base as build

COPY --link package*.json ./

# RUN npm ci --only=production

RUN npm install

COPY --link . .

RUN npm run build
RUN npm prune

FROM base

COPY --from=build /src/dist /src/dist
COPY --from=build /src/node_modules /src/node_modules

EXPOSE 4000

CMD ["npm", "run", "prod"]
FROM node:14-alpine as buildStage

WORKDIR /app/something

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:14-alpine

RUN npm install -g serve

COPY --from=buildStage /app/something/build ./build

CMD ["serve" ,"-s", "./build"]

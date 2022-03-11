FROM node:16.3-alpine3.12

WORKDIR /app

COPY ./dist/cjs/* .

CMD [ "node", "./index.cjs" ]

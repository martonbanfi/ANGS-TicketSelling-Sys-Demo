FROM node:12-alpine AS node-build

RUN apk -v --update add \
    bash \  
    python \
    make \
    gcc \
    g++

USER node
WORKDIR /home/node
ADD . .
RUN npm install && \
    npm run build

FROM node:12-alpine

USER node
WORKDIR /home/node
COPY --from=node-build /home/node/dist ./dist
COPY --from=node-build /home/node/node_modules ./node_modules
COPY --from=node-build /home/node/package.json ./

EXPOSE 8888
ENTRYPOINT [ "npm", "run", "start" ]
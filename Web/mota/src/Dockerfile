ARG NODE_VERSION="15.7-alpine3.10"

FROM node:${NODE_VERSION}

COPY . /mota

RUN npm config set registry https://registry.npm.taobao.org && \
    npm i -g serve

WORKDIR /mota

EXPOSE 3000
ENTRYPOINT [ "serve" ]
FROM node:17.6

RUN sed -i s@/archive.ubuntu.com/@/mirrors.aliyun.com/@g /etc/apt/sources.list \
   && sed -i s@/deb.debian.org/@/mirrors.aliyun.com/@g /etc/apt/sources.list \
   && sed -i s@/security.debian.org/@/mirrors.aliyun.com/@g /etc/apt/sources.list \
   && apt-get clean

RUN apt-get update \
    && apt-get install -y sqlite3

RUN mkdir -p /home/ctf/app
RUN mkdir /home/ctf/app/db

RUN sqlite3 db/ihome.db \
    && sqlite3 ihome.db "CREATE TABLE IF NOT EXISTS appeal(id INTEGER PRIMARY KEY AUTOINCREMENT,appeal_id TEXT,appeal_type TEXT,content TEXT);"

WORKDIR /home/ctf/app

COPY ./package.json ./

RUN npm install

COPY ./ ./

CMD ["node", "server.js"]
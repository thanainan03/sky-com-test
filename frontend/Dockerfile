FROM node:14-alpine

RUN mkdir -p /usr/app/frontend
WORKDIR /usr/app/frontend

COPY package*.json .

RUN npm install

COPY . .

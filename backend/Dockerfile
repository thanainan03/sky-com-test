FROM node:14-alpine

RUN mkdir -p /usr/app/backend
WORKDIR /usr/app/backend

COPY package*.json .

RUN npm install

COPY . .

FROM docker.io/library/nginx:latest

WORKDIR /usr/share/nginx/html

ADD ./dist /usr/share/nginx/html

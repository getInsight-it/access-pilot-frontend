FROM docker.io/library/nginx:latest

WORKDIR /usr/share/nginx/html

ADD ./out /usr/share/nginx/html

FROM docker.io/library/nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY env/nginx.conf /etc/nginx/conf.d/default.conf

COPY ./dist /usr/share/nginx/html

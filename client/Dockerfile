FROM node:latest AS brbotreact

#WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=brbotreact /dist .

#RUN rm /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf

#VOLUME /var/log/nginx/log

#COPY /nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 443 80

#CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["nginx", "-g", "daemon off;"]
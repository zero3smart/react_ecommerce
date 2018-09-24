# build enironment
FROM node:9.10.0 as builder

ARG mobile_env=./docker/.env
ARG desktop_env=./docker/.env.desktop

# set working directory
WORKDIR /srv/src
ENV PATH /srv/src/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /srv/src/package.json
COPY yarn.lock /srv/src/yarn.lock
COPY desktop/package.json /srv/src/desktop/package.json
COPY desktop/yarn.lock /srv/src/desktop/yarn.lock

# install yarn, change permission
RUN npm install -g yarn
RUN chmod a+rwx  /usr/local/lib/node_modules/yarn/bin/yarn*
RUN chmod a+rwx  /usr/local/bin/yarn*

# install package to enable caching
RUN yarn install
RUN cd ./desktop && yarn install

# copy project file
COPY . /srv/src
COPY ./desktop /srv/src/desktop

# use react .env for production
COPY $mobile_env /srv/src/.env
COPY $desktop_env /srv/src/desktop/.env

# build mobile script
ARG PUBLIC_URL=/mobile/public
RUN yarn build

# build desktop script
ARG PUBLIC_URL=/desktop/public
RUN cd ./desktop && yarn build

# production environment
# serve static files with nginx
FROM nginx:latest

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /srv/src/build /srv/www/mobile
COPY --from=builder /srv/src/desktop/build /srv/www/desktop

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

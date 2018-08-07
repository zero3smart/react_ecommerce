# build enironment
FROM node:9.10.0 as builder

# set working directory
WORKDIR /srv/src
ENV PATH /srv/src/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /srv/src/package.json
COPY yarn.lock /srv/src/yarn.lock

# install yarn, change permission
RUN npm install -g yarn
RUN chmod a+rwx  /usr/local/lib/node_modules/yarn/bin/yarn*
RUN chmod a+rwx  /usr/local/bin/yarn*

# install package to enable caching
RUN yarn install

# copy project file
COPY . /srv/src
# use react .env for production
COPY ./docker/.env /srv/src

# build app
RUN yarn build

# production environment
# serve static files with nginx
FROM nginx:latest

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /srv/src/build /srv/www

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

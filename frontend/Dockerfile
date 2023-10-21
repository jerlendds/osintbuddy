FROM node:18-alpine as build-stage
LABEL maintainer="jerlendds <support@forum.osintbuddy.com>"

WORKDIR /app/

COPY package.json yarn.lock ./

RUN yarn

COPY . .

ARG NODE_ENV=${ENVIRONMENT}
ARG REACT_APP_BASE_URL=${BASE_URL}
# TODO: Improve docker file for dev...
# if [ $NODE_ENV=='production' ]; then yarn build
# if [ $NODE_ENV=='development' ]; then yarn start
RUN yarn build

FROM nginx:1.25.0-alpine

COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

FROM node:18-alpine as build-stage
WORKDIR /app/
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build


FROM nginx:1.25.0-alpine

COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

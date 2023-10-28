FROM node:18-alpine
LABEL maintainer="jerlendds <support@forum.osintbuddy.com>"

WORKDIR /app/
COPY package.json yarn.lock ./
RUN yarn install && ls && pwd
COPY . .

CMD [ "yarn", "start" ]

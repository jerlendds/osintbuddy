FROM node:18-alpine
LABEL maintainer="jerlendds <support@forum.osintbuddy.com>"

RUN adduser -D osintbuddy-system
WORKDIR /home/osintbuddy-system
USER osintbuddy-system
COPY package.json yarn.lock ./

ARG REACT_APP_BASE_URL
ENV REACT_APP_BASE_URL ${REACT_APP_BASE_URL}
RUN yarn

USER root
RUN mkdir /app
WORKDIR /app
COPY . .

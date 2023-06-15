FROM golang:1.20.0-alpine3.17
LABEL maintainer="jerlendds <jerlendsdev@proton.me>"

WORKDIR /app
COPY ./google-service/go.mod ./google-service/go.sum ./
RUN go mod download
COPY ./google-service/ .
RUN go build .

ENTRYPOINT [ "./serp-microservice" ]
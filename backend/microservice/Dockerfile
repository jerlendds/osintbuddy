FROM golang:1.20.0-alpine3.17

WORKDIR /app

COPY ./google-service/ .

RUN go build .

ENTRYPOINT [ "./serp-microservice" ]
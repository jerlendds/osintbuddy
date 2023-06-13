FROM golang:1.20.0-alpine3.17
WORKDIR /app
COPY ./google-service/go.mod ./google-service/go.sum ./
RUN go mod download
COPY ./google-service/ .
RUN go build .

ENTRYPOINT [ "./serp-microservice" ]
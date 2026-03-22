FROM golang:1.23-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o bin/server ./cmd/server

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/bin/server .
EXPOSE 8080
CMD ["./server"]
FROM golang:1.26-alpine AS builder
WORKDIR /app

# Install Node
RUN apk add --no-cache nodejs npm

COPY . .

# Build frontend first
RUN cd web && npm install && npx vite build

# Then build Go binary
RUN go build -o bin/server ./cmd/server

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/bin/server .
EXPOSE 8080
CMD ["./server"]

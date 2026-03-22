.PHONY: dev build migrate

dev:
	concurrently "cd web && npx vite --port 5173" "air -c .air.toml"

build:
	cd web && npx vite build
	go build -o bin/server ./cmd/server

migrate:
	goose -dir internal/store/migrations sqlite3 data.db up
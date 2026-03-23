# sahil-singla.up.railway.app

Personal portfolio site — built with Go, TypeScript, and SQLite. Serves a static Vite frontend embedded directly in the Go binary, with a lightweight API for page view tracking and contact form submissions.

---

## Stack

| Layer | Tech |
|---|---|
| Server | Go 1.24 · `net/http` |
| Frontend | TypeScript · Vite 8 |
| Database | SQLite (`modernc.org/sqlite`) |
| Email | Gmail SMTP (`net/smtp`) |
| Deploy | Railway (Docker) |
| Dev | Air (live reload) · Concurrently |

---

## Project Structure

```
.
├── cmd/
│   └── server/
│       └── main.go          # Entrypoint — mux setup, server start
├── internal/
│   ├── handler/
│   │   ├── contact.go       # POST /api/contact
│   │   ├── status.go        # GET /api/status (SSE)
│   │   └── views.go         # GET/POST /api/views/:slug
│   ├── mailer/
│   │   └── mailer.go        # Gmail SMTP sender
│   └── store/
│       ├── db.go            # SQLite init + Store type
│       └── views.go         # Increment / Get view counts
├── assets/
│   ├── assets.go            # go:embed static → http.FileServer
│   └── static/              # Vite build output (gitignored)
├── web/                     # TypeScript + Vite frontend
│   ├── src/
│   │   ├── main.ts
│   │   ├── style.css
│   │   ├── api/             # contact.ts · status.ts · views.ts
│   │   ├── interactions/    # cursor.ts · canvas.ts · magnetic.ts · scroll.ts
│   │   └── sections/        # hero.ts · work.ts · contact.ts
│   ├── index.html
│   └── vite.config.ts       # /api proxy → :8080, outDir → ../assets/static
├── Dockerfile
├── Makefile
└── .air.toml
```

---

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/status` | SSE stream — availability status |
| `POST` | `/api/views/:slug` | Increment + return view count |
| `GET` | `/api/views/:slug` | Get view count |
| `POST` | `/api/contact` | Send contact form email |

### Contact payload
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hey, let's build something."
}
```

---

## Getting Started

### Prerequisites

- Go 1.24+
- Node.js 20+
- [Air](https://github.com/air-verse/air) — `go install github.com/air-verse/air@latest`
- [Concurrently](https://www.npmjs.com/package/concurrently) — `npm i -g concurrently`

### Local dev

```bash
# 1. Clone
git clone https://github.com/li231sd/portfolio
cd portfolio

# 2. Install frontend deps
cd web && npm install && cd ..

# 3. Copy env
cp .env.example .env
# Fill in GMAIL_USER, GMAIL_APP_PASS, CONTACT_TO

# 4. Run (Vite on :5173 + Go on :8080 with live reload)
make dev
```

Vite proxies `/api/*` to `:8080` during development, so the frontend and backend work together seamlessly without CORS config.

### Build for production

```bash
make build
# Outputs: bin/server (Go binary with frontend embedded)
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `GMAIL_USER` | Gmail address to send from |
| `GMAIL_APP_PASS` | [Gmail App Password](https://myaccount.google.com/apppasswords) (not your regular password) |
| `CONTACT_TO` | Email address to receive contact form submissions |
| `PORT` | Port to listen on (default: `8080`) |

> **Dev mode:** If `GMAIL_USER` or `GMAIL_APP_PASS` are unset, the mailer falls back to printing submissions to stdout instead of sending email.

---

## Deployment (Railway)

The project ships as a single Docker image. Railway auto-detects the `Dockerfile` and uses the `CMD` from it — no start command needed.

```bash
# 1. Push to GitHub
# 2. Connect repo in Railway dashboard
# 3. Set environment variables in Railway → Variables tab
# 4. Deploy
```

The Dockerfile builds the Vite frontend first, then compiles the Go binary with the frontend embedded via `go:embed`. The result is a single self-contained binary with zero runtime dependencies.

```dockerfile
FROM golang:1.24-alpine AS builder
WORKDIR /app
RUN apk add --no-cache nodejs npm
COPY . .
RUN cd web && npm install && npx vite build
RUN go build -o bin/server ./cmd/server

FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/bin/server .
EXPOSE 8080
CMD ["./server"]
```

---

## How the embed works

The Vite build outputs to `assets/static/`. The Go binary embeds this directory at compile time:

```go
//go:embed static
var files embed.FS
```

This means the final binary serves HTML, CSS, JS, and all assets with no external file dependencies — perfect for containerized deployments.

---

## Features

- **Animated hero** — canvas-based node graph with pulse animations, throttled to 30fps
- **Smooth scroll** — nav links scroll to sections with nav offset, with a brief tag flash on arrival
- **Custom cursor** — celadon dot + ring with magnetic pull on interactive elements
- **Page view counter** — SQLite-backed, incremented per slug on each visit
- **SSE status** — real-time availability indicator streamed from the server
- **Contact form** — validated on both client and server, sent via Gmail SMTP with `Reply-To` set to the visitor's email
- **Fully embedded** — single Go binary, no separate static file server needed

---

## License

MIT

package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/sahilsingla/portfolio/assets"
	"github.com/sahilsingla/portfolio/internal/handler"
	"github.com/sahilsingla/portfolio/internal/store"
)

func main() {
	_ = godotenv.Load() 

    db := store.Init("data.db")

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/status", handler.Status)
	mux.HandleFunc("POST /api/views/{slug}", handler.IncrementView(db))
	mux.HandleFunc("GET /api/views/{slug}", handler.GetView(db))
	mux.HandleFunc("POST /api/contact", handler.Contact)

	mux.Handle("/", assets.Handler())

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}

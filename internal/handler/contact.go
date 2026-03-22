package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/sahilsingla/portfolio/internal/mailer"
)

type contactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

func Contact(w http.ResponseWriter, r *http.Request) {
	var body contactRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		log.Printf("contact: decode error: %v", err)
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	body.Name    = strings.TrimSpace(body.Name)
	body.Email   = strings.TrimSpace(body.Email)
	body.Message = strings.TrimSpace(body.Message)

	if body.Name == "" || body.Email == "" || body.Message == "" {
		http.Error(w, "name, email and message are required", http.StatusBadRequest)
		return
	}
	if !strings.Contains(body.Email, "@") {
		http.Error(w, "invalid email", http.StatusBadRequest)
		return
	}

	if err := mailer.Send(body.Name, body.Email, body.Message); err != nil {
		log.Printf("contact: mailer error: %v", err)
		http.Error(w, "failed to send", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

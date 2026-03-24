package handler

import (
    "encoding/json"
    "net/http"
    "github.com/sahilsingla/portfolio/internal/mailer" // Adjust path to your project
)

func Contact(w http.ResponseWriter, r *http.Request) {
    var payload struct {
        Name    string `json:"name"`
        Email   string `json:"email"`
        Message string `json:"message"`
    }

    // 1. Decode the JSON from your TypeScript frontend
    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }

    // 2. Call the Web3Forms mailer
    err := mailer.Send(payload.Name, payload.Email, payload.Message)
    if err != nil {
        // This will now log the specific Web3Forms error if it fails
        http.Error(w, "Failed to send message", http.StatusInternalServerError)
        return
    }

    // 3. Success response for your TS fetch call
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("Message sent!"))
}

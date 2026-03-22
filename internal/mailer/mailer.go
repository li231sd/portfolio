package mailer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

type resendPayload struct {
	From    string   `json:"from"`
	To      []string `json:"to"`
	Subject string   `json:"subject"`
	Text    string   `json:"text"`
}

func Send(name, fromEmail, message string) error {
	apiKey := os.Getenv("RESEND_API_KEY")
	to     := os.Getenv("CONTACT_TO")

	// Dev mode — no env vars set, just print
	if apiKey == "" || to == "" {
		fmt.Printf("\n--- Contact Form ---\nFrom: %s <%s>\n%s\n---\n",
			name, fromEmail, message)
		return nil
	}

	payload := resendPayload{
		From:    "Portfolio Contact <onboarding@resend.dev>",
		To:      []string{to},
		Subject: fmt.Sprintf("Portfolio contact from %s", name),
		Text: fmt.Sprintf(
			"Name: %s\nEmail: %s\n\n%s", name, fromEmail, message,
		),
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("resend error: status %d", resp.StatusCode)
	}
	return nil
}

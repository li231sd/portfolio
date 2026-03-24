package mailer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

func Send(name, fromEmail, message string) error {
	accessKey := os.Getenv("WEB3FORMS_KEY")
	toEmail := os.Getenv("CONTACT_TO")

	if accessKey == "" {
		return fmt.Errorf("WEB3FORMS_KEY is missing")
	}

	// The payload Web3Forms expects
	payload := map[string]interface{}{
		"access_key": accessKey,
		"from_name":  name,
		"email":      fromEmail,
		"replyto":    fromEmail,
		"subject":    "New Portfolio Inquiry",
		"message":    message,
		"to":         toEmail,
		"json_cache": "true", // CRITICAL: Tells Web3Forms to return JSON, not a redirect
	}

	jsonData, _ := json.Marshal(payload)

	// Create request with custom headers to avoid 403
	req, err := http.NewRequest("POST", "https://api.web3forms.com/submit", bytes.NewBuffer(jsonData))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		// ADD THIS LINE TEMPORARILY:
		fmt.Printf("DEBUG WEB3FORMS: %s\n", string(body)) 
		return fmt.Errorf("web3forms error (%d): %s", resp.StatusCode, string(body))
	}

	return nil
}

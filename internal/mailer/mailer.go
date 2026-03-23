package mailer

import (
	"crypto/tls"
	"fmt"
	"net/smtp"
	"os"
)

func Send(name, fromEmail, message string) error {
	gmailUser := os.Getenv("GMAIL_USER")
	gmailPass := os.Getenv("GMAIL_APP_PASS")
	to        := os.Getenv("CONTACT_TO")

	if gmailUser == "" || gmailPass == "" {
		fmt.Printf("\n--- Contact Form ---\nFrom: %s <%s>\n%s\n---\n", name, fromEmail, message)
		return nil
	}

	subject := fmt.Sprintf("Portfolio contact from %s", name)
	body    := fmt.Sprintf("Name: %s\nEmail: %s\n\n%s", name, fromEmail, message)
	msg     := fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nReply-To: %s\r\nSubject: %s\r\n\r\n%s",
		gmailUser, to, fromEmail, subject, body,
	)

	tlsConfig := &tls.Config{ServerName: "smtp.gmail.com"}
	conn, err := tls.Dial("tcp", "smtp.gmail.com:465", tlsConfig)
	if err != nil {
		return fmt.Errorf("tls dial: %w", err)
	}

	client, err := smtp.NewClient(conn, "smtp.gmail.com")
	if err != nil {
		return fmt.Errorf("smtp client: %w", err)
	}
	defer client.Close()

	auth := smtp.PlainAuth("", gmailUser, gmailPass, "smtp.gmail.com")
	if err = client.Auth(auth); err != nil {
		return fmt.Errorf("smtp auth: %w", err)
	}

	if err = client.Mail(gmailUser); err != nil {
		return fmt.Errorf("smtp mail: %w", err)
	}
	if err = client.Rcpt(to); err != nil {
		return fmt.Errorf("smtp rcpt: %w", err)
	}

	w, err := client.Data()
	if err != nil {
		return fmt.Errorf("smtp data: %w", err)
	}
	if _, err = w.Write([]byte(msg)); err != nil {
		return fmt.Errorf("smtp write: %w", err)
	}

	return w.Close()
}

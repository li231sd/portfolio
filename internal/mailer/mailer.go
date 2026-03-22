package mailer

import (
	"fmt"
	"net/smtp"
	"os"
)

func Send(name, fromEmail, message string) error {
	gmailUser := os.Getenv("GMAIL_USER")     // your.email@gmail.com
	gmailPass := os.Getenv("GMAIL_APP_PASS") // the app password
	to        := os.Getenv("CONTACT_TO")     // same gmail or any email

	if gmailUser == "" || gmailPass == "" {
		fmt.Printf("\n--- Contact Form ---\nFrom: %s <%s>\n%s\n---\n", name, fromEmail, message)
		return nil
	}

	subject := fmt.Sprintf("Portfolio contact from %s", name)
	body := fmt.Sprintf("Name: %s\nEmail: %s\n\n%s", name, fromEmail, message)
	msg := fmt.Sprintf("From: %s\r\nTo: %s\r\nReply-To: %s\r\nSubject: %s\r\n\r\n%s",
		gmailUser, to, fromEmail, subject, body)

	auth := smtp.PlainAuth("", gmailUser, gmailPass, "smtp.gmail.com")
	return smtp.SendMail("smtp.gmail.com:587", auth, gmailUser, []string{to}, []byte(msg))
}

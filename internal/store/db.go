package store

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

type Store struct {
	db *sql.DB
}

func Init(path string) *Store {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS views (
			slug  TEXT PRIMARY KEY,
			count INTEGER NOT NULL DEFAULT 0
		)
	`)
	if err != nil {
		log.Fatal(err)
	}

	return &Store{db: db}
}

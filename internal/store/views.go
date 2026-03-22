package store

func (s *Store) Increment(slug string) (int64, error) {
	_, err := s.db.Exec(`
		INSERT INTO views (slug, count) VALUES (?, 1)
		ON CONFLICT(slug) DO UPDATE SET count = count + 1
	`, slug)
	if err != nil {
		return 0, err
	}

	var n int64
	err = s.db.QueryRow(`SELECT count FROM views WHERE slug = ?`, slug).Scan(&n)
	return n, err
}

func (s *Store) Get(slug string) (int64, error) {
	var n int64
	err := s.db.QueryRow(`SELECT count FROM views WHERE slug = ?`, slug).Scan(&n)
	if err != nil {
		return 0, err
	}
	return n, nil
}

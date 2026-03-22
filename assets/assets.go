package assets

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
)

//go:embed static
var files embed.FS

func Handler() http.Handler {
	sub, err := fs.Sub(files, "static")
	if err != nil {
		log.Fatal(err)
	}
	return http.FileServer(http.FS(sub))
}

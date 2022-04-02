package main

import (
	"os"

	"backend/app"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}
	app.Start(port)
}

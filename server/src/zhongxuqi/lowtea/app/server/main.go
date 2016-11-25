package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/api/test", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "{\"status\":200, \"message\": \"success\"}")
	})
	http.Handle("/", http.FileServer(http.Dir("../front/dist")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}

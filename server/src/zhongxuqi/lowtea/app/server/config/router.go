package config

import (
	"fmt"
	"net/http"

	"zhongxuqi/lowtea/app/server/servermodel"
)

// InitRouter init the router of server
func InitRouter(mainServer *servermodel.MainServer) {
	mainServer.Mux.HandleFunc("/api/test", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "{\"status\":200, \"message\": \"success\"}")
	})

	mainServer.Mux.Handle("/", http.FileServer(http.Dir("../front/dist")))
}

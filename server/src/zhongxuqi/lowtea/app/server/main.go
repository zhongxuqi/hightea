package main

import (
	"net/http"
	"time"

	"zhongxuqi/lowtea/app/server/config"
	"zhongxuqi/lowtea/app/server/servermodel"
)

func main() {
	mainServer := &servermodel.MainServer{
		Mux: http.NewServeMux(),
	}
	config.InitEnv(mainServer)
	config.InitRouter(mainServer)
	config.InitDB(mainServer)

	httpServer := &http.Server{
		Addr:           "0.0.0.0:8080",
		Handler:        mainServer.Mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	httpServer.ListenAndServe()
}

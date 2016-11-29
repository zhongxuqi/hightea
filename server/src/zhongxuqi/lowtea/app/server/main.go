package main

import (
	"net/http"
	"time"

	"zhongxuqi/lowtea/app/server/config"
	"zhongxuqi/lowtea/app/server/handler"
)

func main() {
	mainHandler := handler.New()

	config.InitEnv(mainHandler)
	config.InitRouter(mainHandler)
	config.InitDB(mainHandler)

	httpServer := &http.Server{
		Addr:           "0.0.0.0:8080",
		Handler:        mainHandler.Mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	httpServer.ListenAndServe()
}

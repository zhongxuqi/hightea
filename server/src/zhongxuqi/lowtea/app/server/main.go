package main

import (
	"fmt"
	"log"
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
	config.InitOss(mainHandler)

	httpServer := &http.Server{
		Addr:           mainHandler.Config.ServerAddr,
		Handler:        mainHandler.Mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	fmt.Printf("server listen at %s\n", mainHandler.Config.ServerAddr)
	log.Fatal(httpServer.ListenAndServe())
}

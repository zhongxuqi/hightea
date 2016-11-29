package config

import (
	"net/http"

	"zhongxuqi/lowtea/app/server/handler"
)

// InitRouter init the router of server
func InitRouter(mainHandler *handler.MainHandler) {

	// init open api handler
	openAPIHandler := http.NewServeMux()
	openAPIHandler.HandleFunc("/openapi/login", mainHandler.Login)
	mainHandler.Mux.HandleFunc("/openapi", func(w http.ResponseWriter, r *http.Request) {
		openAPIHandler.ServeHTTP(w, r)
	})

	// init api handler
	apiHandler := http.NewServeMux()
	apiHandler.HandleFunc("/api/user/userinfo", mainHandler.GetUserInfo)
	mainHandler.Mux.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {

		// check cookie
		err := mainHandler.CheckSession(w, r)
		if err != nil {
			http.Error(w, "[Handle /api] "+err.Error(), 400)
			return
		}

		apiHandler.ServeHTTP(w, r)
	})

	// init web file handler
	mainHandler.Mux.Handle("/", http.FileServer(http.Dir("../front/dist")))
}

package config

import (
	"net/http"

	"zhongxuqi/lowtea/app/server/handler"
)

// InitRouter init the router of server
func InitRouter(mainHandler *handler.MainHandler) {

	//---------------------------------
	//
	// init openapi handlers
	//
	//---------------------------------
	openAPIHandler := http.NewServeMux()
	openAPIHandler.HandleFunc("/openapi/login", mainHandler.Login)
	openAPIHandler.HandleFunc("/openapi/register", mainHandler.Register)
	openAPIHandler.HandleFunc("/openapi/logout", mainHandler.Logout)
	openAPIHandler.HandleFunc("/openapi/documents", mainHandler.ActionPublicDocuments)
	openAPIHandler.HandleFunc("/openapi/document/", mainHandler.ActionPublicDocument)
	openAPIHandler.HandleFunc("/openapi/public_top_star_documents", mainHandler.ActionPublicTopStarDocuments)
	openAPIHandler.HandleFunc("/openapi/public_top_flag_documents", mainHandler.ActionPublicTopFlagDocuments)
	mainHandler.Mux.HandleFunc("/openapi/", func(w http.ResponseWriter, r *http.Request) {
		openAPIHandler.ServeHTTP(w, r)
	})

	//---------------------------------
	//
	// init api handlers
	//
	//---------------------------------
	apiHandler := http.NewServeMux()
	memberHandler := http.NewServeMux()
	adminHandler := http.NewServeMux()

	// setup /api/ handler
	mainHandler.Mux.HandleFunc("/api/", func(w http.ResponseWriter, r *http.Request) {

		// check cookie
		err := mainHandler.CheckSession(w, r)
		if err != nil {
			http.Error(w, "[Handle /api/user/] "+err.Error(), 400)
			return
		}

		apiHandler.ServeHTTP(w, r)
	})

	// setup /api/member/ handler
	memberHandler.HandleFunc("/api/member/self", mainHandler.ActionSelf)
	memberHandler.HandleFunc("/api/member/self_password", mainHandler.ActionSelfPassword)
	memberHandler.HandleFunc("/api/member/users", mainHandler.GetUsers)
	memberHandler.HandleFunc("/api/member/upload_image", mainHandler.ActionUpLoadImage)
	memberHandler.HandleFunc("/api/member/upload_audio", mainHandler.ActionUpLoadAudio)
	memberHandler.HandleFunc("/api/member/upload_video", mainHandler.ActionUpLoadVideo)
	memberHandler.HandleFunc("/api/member/documents", mainHandler.ActionDocuments)
	memberHandler.HandleFunc("/api/member/document", mainHandler.ActionDocument)
	memberHandler.HandleFunc("/api/member/document/", mainHandler.ActionDocument)
	memberHandler.HandleFunc("/api/member/drafts", mainHandler.ActionDrafts)
	memberHandler.HandleFunc("/api/member/star/", mainHandler.ActionStar)
	memberHandler.HandleFunc("/api/member/star_documents", mainHandler.ActionStarDocuments)
	memberHandler.HandleFunc("/api/member/top_star_documents", mainHandler.ActionTopStarDocuments)
	memberHandler.HandleFunc("/api/member/self_top_star_documents", mainHandler.ActionSelfTopStarDocuments)
	memberHandler.HandleFunc("/api/member/top_flag_documents", mainHandler.ActionTopFlagDocuments)
	apiHandler.HandleFunc("/api/member/", func(w http.ResponseWriter, r *http.Request) {
		memberHandler.ServeHTTP(w, r)
	})

	// setup /api/admin/ handler
	adminHandler.HandleFunc("/api/admin/registers", mainHandler.GetRegisters)
	adminHandler.HandleFunc("/api/admin/register", mainHandler.ActionRegister)
	adminHandler.HandleFunc("/api/admin/user/", mainHandler.AdminActionUser)
	adminHandler.HandleFunc("/api/admin/flag/", mainHandler.ActionFlag)
	apiHandler.HandleFunc("/api/admin/", func(w http.ResponseWriter, r *http.Request) {

		// check permission
		err := mainHandler.CheckAdmin(r)
		if err != nil {
			http.Error(w, "check permission error: "+err.Error(), 400)
			return
		}

		adminHandler.ServeHTTP(w, r)
	})

	// init web file handler
	mainHandler.Mux.Handle("/", http.FileServer(http.Dir("../front/dist")))
}

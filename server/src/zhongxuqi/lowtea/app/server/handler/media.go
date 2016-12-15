package handler

import (
	"encoding/json"
	"net/http"
	"zhongxuqi/lowtea/model"
)

func (p *MainHandler) ActionUpLoadImage(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		err := r.ParseMultipartForm(1024 * 1024 * 1024)
		if err != nil {
			http.Error(w, "parse multipart form error: "+err.Error(), 400)
			return
		}
		imageBody, _, err := r.FormFile("imagefile")
		if err != nil {
			http.Error(w, "form file \"imagefile\" error: "+err.Error(), 400)
			return
		}
		if p.Oss == nil {
			http.Error(w, "oss is not configured.", 500)
			return
		}
		imageUrl, err := p.Oss.SaveImage(&imageBody)
		if err != nil {
			http.Error(w, "save image error: "+err.Error(), 500)
			return
		}

		var respData struct {
			model.RespBase
			ImageUrl string `json:"imageUrl"`
		}
		respData.Status = 200
		respData.Message = "success"
		respData.ImageUrl = imageUrl

		respByte, _ := json.Marshal(&respData)
		w.Write(respByte)
		return
	}
	http.Error(w, "not found", 404)
}

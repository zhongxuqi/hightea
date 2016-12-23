package handler

import (
	"encoding/json"
	"net/http"
	"zhongxuqi/lowtea/model"
)

func (p *MainHandler) ActionRootEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		var respBody struct {
			model.RespBase
			RootEmail string `json:"rootEmail"`
		}
		respBody.RootEmail = p.Config.RootEmail
		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
}

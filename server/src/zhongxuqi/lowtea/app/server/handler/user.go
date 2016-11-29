package handler

import (
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"encoding/json"
	"zhongxuqi/lowtea/model"
)

func (p *MainHandler) GetUserInfo(w http.ResponseWriter, r *http.Request) {
	accountCookie, err := r.Cookie("account")
	if err != nil {
		http.Error(w, "[GetUserInfo] find cookie error: "+err.Error(), 400)
		return
	}

	var ret struct {
		User model.User `json:"user"`
	}
	err = p.UserColl.Find(bson.M{"account": accountCookie.Value}).One(&(ret.User))
	if err != nil {
		http.Error(w, "[GetUserInfo] find account: "+err.Error(), 400)
		return
	}
	retbyte, _ := json.Marshal(ret)
	w.Write(retbyte)
	w.WriteHeader(200)
}

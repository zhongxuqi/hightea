package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"

	"labix.org/v2/mgo/bson"
)

var (
	ERROR_USERNAME_EXISTS = errors.New("username exists")
)

// Login do login
func (p *MainHandler) Login(w http.ResponseWriter, r *http.Request) {
	var dataStruct struct {
		Account    string `json:"account"`
		ExpireTime int64  `json:"expireTime"`
		Sign       string `json:"sign"`
	}
	err := utils.ReadReq2Struct(r, &dataStruct)
	if err != nil {
		http.Error(w, "[Login] data read and unmarshal fail: "+err.Error(), 400)
		return
	}

	if dataStruct.ExpireTime < time.Now().Unix() {
		http.Error(w, "[Login] "+ERROR_TIME_EXPIRED.Error(), 400)
		return
	}

	err = p.checkSign(dataStruct.Account, dataStruct.ExpireTime, dataStruct.Sign)
	if err != nil {
		http.Error(w, "check sign fail: "+err.Error(), 400)
		return
	}

	// if pass check sign, update session
	p.UpdateSession(w, dataStruct.Account)

	var user model.User
	if dataStruct.Account == model.ROOT {
		user = model.User{
			Account:  model.ROOT,
			NickName: model.ROOT,
			Role:     model.ROOT,
		}
	} else {
		err = p.UserColl.Find(bson.M{"account": dataStruct.Account}).One(&user)
		if err != nil {
			http.Error(w, "find User error: "+err.Error(), 400)
			return
		}
	}

	var ret struct {
		model.RespBase
		User *model.User `json:"user"`
	}
	ret.Status = 200
	ret.Message = "success"
	ret.User = &user

	retStr, _ := json.Marshal(ret)
	w.WriteHeader(200)
	w.Write(retStr)
}

// Register do register
func (p *MainHandler) Register(w http.ResponseWriter, r *http.Request) {
	var data model.Register
	err := utils.ReadReq2Struct(r, data)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	// check the account
	if data.Account == model.ROOT {
		http.Error(w, ERROR_USERNAME_EXISTS.Error(), 400)
		return
	}
	n, err := p.UserColl.Find(bson.M{"account": data.Account}).Count()
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	} else if n > 0 {
		http.Error(w, ERROR_USERNAME_EXISTS.Error(), 400)
		return
	}
	n, err = p.ReqisterColl.Find(bson.M{"account": data.Account}).Count()
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	} else if n > 0 {
		http.Error(w, ERROR_USERNAME_EXISTS.Error(), 400)
		return
	}

	err = p.ReqisterColl.Insert(data)
	if err != nil {
		http.Error(w, "[Register] insert error: "+err.Error(), 400)
		return
	}

	w.WriteHeader(200)
	retStr, _ := json.Marshal(&model.RespBase{
		Status:  200,
		Message: "success",
	})
	w.Write(retStr)
}

// Logout do logout
func (p *MainHandler) Logout(w http.ResponseWriter, r *http.Request) {
	p.ClearSession(w)
	retStr, _ := json.Marshal(&model.RespBase{
		Status:  200,
		Message: "success",
	})
	w.Write(retStr)
}

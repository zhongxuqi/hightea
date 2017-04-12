package handler

import (
	"encoding/json"
	"net/http"

	"zhongxuqi/lowtea/errors"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"
)

// GetRegisters get registers
func (p *MainHandler) GetRegisters(w http.ResponseWriter, r *http.Request) {
	var ret struct {
		model.RespBase
		Registers []model.Register `json:"registers"`
	}
	var err error
	ret.Registers, err = p.RegisterModel.GetAll()
	if err != nil {
		http.Error(w, "find register error"+err.Error(), 500)
		return
	}
	ret.Status = 200
	ret.Message = "success"
	retStr, _ := json.Marshal(ret)
	w.Write(retStr)
	return
}

// ActionRegister action register
func (p *MainHandler) ActionRegister(w http.ResponseWriter, r *http.Request) {
	var data struct {
		Action  string `json:"action"`
		Account string `json:"account"`
	}
	err := utils.ReadReq2Struct(r, &data)
	if err != nil {
		http.Error(w, err.Error(), 400)
	}

	if data.Action == "agree" {
		var registerObj model.Register
		registerObj, err = p.RegisterModel.FindByAccount(data.Account)
		if err != nil {
			http.Error(w, "register find error: "+err.Error(), 400)
			return
		}
		var user model.User
		user.Account = registerObj.Account
		user.PassWord = registerObj.PassWord
		user.NickName = registerObj.NickName
		user.Email = registerObj.Email
		user.Gender = ""
		user.UserIntro = ""
		user.Role = model.MEMBER
		err = p.UserModel.Insert(user)
		if err != nil {
			http.Error(w, "user insert error: "+err.Error(), 400)
			return
		}
		err = p.RegisterModel.RemoveByAccount(data.Account)
		if err != nil {
			http.Error(w, "register remove error: "+err.Error(), 400)
			return
		}
		retStr, _ := json.Marshal(model.RespBase{
			Status:  200,
			Message: "success",
		})
		w.Write(retStr)
	} else if data.Action == "deny" {
		err = p.RegisterModel.RemoveByAccount(data.Account)
		if err != nil {
			http.Error(w, "register remove error: "+err.Error(), 400)
			return
		}
		retStr, _ := json.Marshal(model.RespBase{
			Status:  200,
			Message: "success",
		})
		w.Write(retStr)
	} else {
		http.Error(w, errors.ERROR_ACTION_INVALID.Error(), 400)
	}
}

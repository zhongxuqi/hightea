package handler

import (
	"encoding/json"
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"zhongxuqi/lowtea/errors"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"
)

// GetRegisters get registers
func (p *MainHandler) GetRegisters(w http.ResponseWriter, r *http.Request) {
	var ret struct {
		model.RespBase
		Registers []bson.M `json:"registers"`
	}

	err := p.RegisterColl.Find(bson.M{}).All(&(ret.Registers))
	if err != nil {
		http.Error(w, "find register error"+err.Error(), 500)
		return
	}

	// delete password
	for i := range ret.Registers {
		ret.Registers[i]["id"] = ret.Registers[i]["_id"]
		delete(ret.Registers[i], "password")
		delete(ret.Registers[i], "_id")
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
		err = p.RegisterColl.Find(bson.M{"account": data.Account}).One(&registerObj)
		if err != nil {
			http.Error(w, "register find error: "+err.Error(), 400)
			return
		}
		user := bson.M{}
		user["account"] = registerObj.Account
		user["password"] = registerObj.PassWord
		user["nickname"] = registerObj.NickName
		user["email"] = ""
		user["gender"] = ""
		user["userintro"] = ""
		user["role"] = model.MEMBER
		err = p.UserColl.Insert(user)
		if err != nil {
			http.Error(w, "user insert error: "+err.Error(), 400)
			return
		}
		err = p.RegisterColl.Remove(bson.M{"account": data.Account})
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
		err = p.RegisterColl.Remove(bson.M{"account": data.Account})
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

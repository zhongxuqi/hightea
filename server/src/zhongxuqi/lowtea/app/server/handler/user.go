package handler

import (
	"net/http"

	"gopkg.in/mgo.v2/bson"

	"encoding/json"
	"strings"
	"zhongxuqi/lowtea/errors"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"
)

// ActionSelf members action self
func (p *MainHandler) ActionSelf(w http.ResponseWriter, r *http.Request) {
	var accountCookie *http.Cookie
	var err error
	accountCookie, err = r.Cookie("account")
	if err != nil {
		http.Error(w, "cookie find error: "+err.Error(), 500)
		return
	}
	var self model.User
	if accountCookie.Value == model.ROOT {
		self = model.User{
			Account:   model.ROOT,
			NickName:  model.ROOT,
			UserIntro: "",
			Gender:    "",
			Role:      model.ROOT,
		}
	} else {
		err = p.UserColl.Find(bson.M{"account": accountCookie.Value}).One(&self)
		if err != nil {
			http.Error(w, "user find error: "+err.Error(), 500)
			return
		}
	}

	if r.Method == http.MethodGet {
		var ret struct {
			model.RespBase
			User model.User `json:"user"`
		}
		if accountCookie.Value == model.ROOT {
			ret.User = model.User{
				Account:   model.ROOT,
				NickName:  model.ROOT,
				UserIntro: "",
				Gender:    "",
				Role:      model.ROOT,
				Language:  p.Config.RootLanguage,
			}
		} else {
			err = p.UserColl.Find(bson.M{"account": accountCookie.Value}).One(&(ret.User))
			if err != nil {
				http.Error(w, "[GetUserInfo] find account: "+err.Error(), 400)
				return
			}
		}

		ret.Status = 200
		ret.Message = "success"
		retbyte, _ := json.Marshal(ret)
		w.Write(retbyte)
		return
	} else if r.Method == http.MethodPost {
		var data struct {
			NickName  string `json:"nickname"`
			Email     string `json:"email"`
			UserIntro string `json:"userintro"`
			Gender    string `json:"gender"`
			Language  string `json:"language"`
		}
		err := utils.ReadReq2Struct(r, &data)
		if err != nil {
			http.Error(w, "user post json unmarshal error: "+err.Error(), 400)
			return
		}

		if self.Role == model.ROOT {
			p.Config.RootLanguage = data.Language
		} else {
			err = p.UserColl.Update(bson.M{"account": self.Account}, bson.M{"$set": data})
			if err != nil {
				http.Error(w, "user info update error: "+err.Error(), 500)
				return
			}
		}

		var ret struct {
			model.RespBase
			Language string `json:"language"`
		}
		ret.Status = 200
		ret.Message = "success"
		ret.Language = data.Language
		retStr, _ := json.Marshal(ret)
		w.Write(retStr)
		return
	}

	retStr, _ := json.Marshal(model.RespBase{
		Status:  200,
		Message: "success",
	})
	w.Write(retStr)
	return
}

// ActionSelfPassword edit the password of self
func (p *MainHandler) ActionSelfPassword(w http.ResponseWriter, r *http.Request) {
	var accountCookie *http.Cookie
	var err error
	accountCookie, err = r.Cookie("account")
	if err != nil {
		http.Error(w, "cookie find error: "+err.Error(), 500)
		return
	}
	if accountCookie.Value == model.ROOT {
		http.Error(w, errors.ERROR_SET_ROOTPASSWORD.Error(), 400)
		return
	}

	if r.Method == http.MethodPost {
		var data struct {
			PassWord    string `json:"password"`
			NewPassWord string `json:"newPassword"`
		}
		err := utils.ReadReq2Struct(r, &data)
		if err != nil {
			http.Error(w, "user post json unmarshal error: "+err.Error(), 400)
			return
		}

		err = p.UserColl.Update(bson.M{"account": accountCookie.Value, "password": data.PassWord}, bson.M{
			"$set": bson.M{
				"password": data.NewPassWord,
			},
		})
		if err != nil {
			http.Error(w, "password update error: "+err.Error(), 500)
			return
		}

		p.UpdateSession(w, accountCookie.Value)
		retStr, _ := json.Marshal(model.RespBase{
			Status:  200,
			Message: "success",
		})
		w.Write(retStr)
		return
	}

	http.Error(w, errors.ERROR_INVAIL_METHOD.Error(), 400)
	return
}

// GetUsers get users
func (p *MainHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	var ret struct {
		model.RespBase
		Users []model.User `json:"users"`
	}
	ret.Users = make([]model.User, 0)
	err := p.UserColl.Find(bson.M{}).All(&(ret.Users))
	if err != nil {
		http.Error(w, "users find error: "+err.Error(), 500)
		return
	}
	ret.Status = 200
	ret.Message = "success"
	retStr, _ := json.Marshal(ret)
	w.Write(retStr)
	return
}

// AdminActionUser admins action to a user
func (p *MainHandler) AdminActionUser(w http.ResponseWriter, r *http.Request) {
	filter := bson.M{}
	cmds := strings.Split(r.URL.Path, "/")[4:]
	if len(cmds) <= 0 {
		http.Error(w, errors.ERROR_MISS_ACCOUNT.Error(), 400)
		return
	}
	filter["account"] = cmds[0]

	// check permission
	var accountCookie *http.Cookie
	var err error
	accountCookie, err = r.Cookie("account")
	if err != nil {
		http.Error(w, "cookie find error: "+err.Error(), 500)
		return
	}
	var self model.User
	if accountCookie.Value == model.ROOT {
		self = model.User{
			Account: model.ROOT,
			Role:    model.ROOT,
		}
	} else {
		err = p.UserColl.Find(bson.M{"account": accountCookie.Value}).One(&self)
		if err != nil {
			http.Error(w, "user find error: "+err.Error(), 500)
			return
		}
	}

	var user model.User
	err = p.UserColl.Find(filter).One(&user)
	if err != nil {
		http.Error(w, "user find error: "+err.Error(), 500)
		return
	}

	if r.Method == http.MethodDelete {

		// check permission
		if self.Role != model.ROOT && (user.Role == model.ADMIN || user.Role == model.ROOT) {
			http.Error(w, errors.ERROR_PERMISSION_DENIED.Error(), 400)
			return
		}

		err := p.UserColl.Remove(filter)
		if err != nil {
			http.Error(w, "user remove error: "+err.Error(), 500)
			return
		}
	} else if r.Method == http.MethodPost {

		// check permission
		if self.Role != model.ROOT {
			http.Error(w, errors.ERROR_PERMISSION_DENIED.Error(), 400)
			return
		}

		var data struct {
			Role string `json:"role"`
		}
		err := utils.ReadReq2Struct(r, &data)
		if err != nil {
			http.Error(w, "user post json unmarshal error: "+err.Error(), 400)
			return
		}
		err = p.UserColl.Update(filter, bson.M{"$set": bson.M{
			"role": data.Role,
		}})
		if err != nil {
			http.Error(w, "user info update error: "+err.Error(), 500)
			return
		}
	}

	retStr, _ := json.Marshal(model.RespBase{
		Status:  200,
		Message: "success",
	})
	w.Write(retStr)
	return
}

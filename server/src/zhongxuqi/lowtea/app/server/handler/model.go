package handler

import (
	"fmt"
	"net/http"
	"strconv"

	"gopkg.in/mgo.v2/bson"

	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
	"time"
	"zhongxuqi/lowtea/config"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/oss"
	"zhongxuqi/lowtea/utils"
)

var (
	ERROR_TIME_EXPIRED    = errors.New("time expired")
	ERROR_TOKEN_INVALID   = errors.New("token is invalid")
	ERROR_SESSION_INVALID = errors.New("session is invalid")
)

// MainHandler ...
type MainHandler struct {
	Mux           *http.ServeMux
	SessModel     *model.SessionModel
	Config        model.Config
	Oss           oss.OssIBase
	AppConfModel  *model.AppConfigModel
	UserModel     *model.UserModel
	DocumentModel *model.DocumentModel
	RegisterModel *model.RegisterModel
	StarModel     *model.StarModel
	FlagModel     *model.FlagModel
}

// New new MainHandler
func New() (handler *MainHandler) {
	handler = &MainHandler{
		Mux: http.NewServeMux(),
	}

	// GC for session
	go func() {
		for {
			time.Sleep(5 * time.Minute)
			handler.SessModel.ClearSessionByLimitTime(time.Now().Unix())
		}
	}()
	return
}

// CheckSession check the session of request
func (p *MainHandler) CheckSession(w http.ResponseWriter, r *http.Request) (err error) {
	var tokenCookie, accountCookie *http.Cookie
	tokenCookie, err = r.Cookie("token")
	if err != nil {
		return
	}
	var sess model.Session
	sess, err = p.SessModel.GetSessionByToken(tokenCookie.Value)
	if err != nil {
		err = errors.New("find session error: " + err.Error())
		return
	}
	if sess.ExpiredTime < time.Now().Unix() {
		err = ERROR_SESSION_INVALID
		return
	} else if sess.ExpiredTime-time.Now().Unix() < config.SESSION_UPDATE_TIME {
		accountCookie, err = r.Cookie("account")
		p.UpdateSession(w, accountCookie.Value)
	}
	return
}

// sign string is account+password+expireTime
func (p *MainHandler) getSignStr(account string, expireTime int64) (rawStr string, err error) {
	rawStr = ""
	if account == model.ROOT {
		password := md5.Sum([]byte(p.Config.RootPassword))
		rawStr += model.ROOT + string(hex.EncodeToString(password[:])) + strconv.FormatInt(expireTime, 10)
	} else {
		var user model.User
		user, err = p.UserModel.FindByAccount(account)
		if err != nil {
			return
		}
		rawStr += user.Account + user.PassWord + strconv.FormatInt(expireTime, 10)
	}
	return rawStr, err
}

func (p *MainHandler) checkSign(account string, expireTime int64, sign string) (err error) {
	var rawStr string
	rawStr, err = p.getSignStr(account, expireTime)
	sum := md5.Sum([]byte(rawStr))
	if hex.EncodeToString(sum[:]) != sign {
		err = ERROR_TOKEN_INVALID
	}
	return
}

// CalculateSign calculate the sign
func (p *MainHandler) CalculateSign(account string, expireTime int64) (ret string, err error) {
	var rawStr string
	rawStr, err = p.getSignStr(account, expireTime)
	sum := md5.Sum([]byte(rawStr))
	return hex.EncodeToString(sum[:]), err
}

// UpdateSession update the session of http header
func (p *MainHandler) UpdateSession(w http.ResponseWriter, account string) {
	expireTime := time.Now().Add(config.EXPIRE_TIME)
	token, err := p.CalculateSign(account, expireTime.Unix())
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	accountCookie := &http.Cookie{
		Name:     "account",
		Value:    account,
		Path:     "/",
		HttpOnly: true,
	}
	w.Header().Add("Set-Cookie", accountCookie.String())
	tokenCookie := &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
	}
	w.Header().Add("Set-Cookie", tokenCookie.String())
	p.SessModel.InsertSession(token, expireTime.Unix())
}

// ClearSession update the session of http header
func (p *MainHandler) ClearSession(w http.ResponseWriter) {
	accountCookie := &http.Cookie{
		Name:     "account",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
	}
	w.Header().Add("Set-Cookie", accountCookie.String())
	tokenCookie := &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
	}
	w.Header().Add("Set-Cookie", tokenCookie.String())
}

func (p *MainHandler) ActionFlagExpiredTime(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var params struct {
			FlagExpiredTime int64 `json:"flagExpiredTime"`
		}
		err := utils.ReadReq2Struct(r, &params)
		if err != nil {
			http.Error(w, "read request params error: "+err.Error(), 400)
			return
		}
		if params.FlagExpiredTime <= 0 {
			http.Error(w, "error: flag expired time setted to 0", 400)
			return
		}
		err = p.AppConfModel.Update(p.Config.DBConfig.DBName, bson.M{"flagExpiredTime": params.FlagExpiredTime})
		if err != nil {
			http.Error(w, "update flag expired time error: "+err.Error(), 500)
			return
		}
		p.Config.FlagExpiredTime = params.FlagExpiredTime

		respByte, _ := json.Marshal(&model.RespBase{
			Status:  200,
			Message: "success",
		})
		w.Write(respByte)
		return
	} else if r.Method == http.MethodGet {
		var appConf model.AppConfig
		var err error
		appConf, err = p.AppConfModel.Find(p.Config.DBConfig.DBName)
		if err != nil {
			http.Error(w, "find flag expired time error: "+err.Error(), 500)
			return
		}

		var respBody struct {
			model.RespBase
			FlagExpiredTime int64 `json:"flagExpiredTime"`
		}
		respBody.FlagExpiredTime = appConf.FlagExpiredTime
		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
}

func (p *MainHandler) ClearUselessMedia() {
	fileMap, err := p.Oss.GetAllMedia()
	if err != nil {
		fmt.Println("oss get all media fail: ", err.Error())
		return
	}

	// check user head image
	var users []model.User
	users, err = p.UserModel.GetAll()
	if err != nil {
		fmt.Println("get all user fail: ", err.Error())
		return
	}
	for _, user := range users {
		if _, ok := fileMap[user.HeadImg]; ok {
			delete(fileMap, user.HeadImg)
		}
	}

	// check document content
	var documents []model.Document
	documents, err = p.DocumentModel.GetAll()
	if err != nil {
		fmt.Println("get all document fail: ", err.Error())
		return
	}
	pattern := p.Oss.GetRegExpPattern()
	for _, document := range documents {
		mediaFileUrls := pattern.FindAllString(document.Content, -1)
		for _, mediaFileUrl := range mediaFileUrls {
			if _, ok := fileMap[mediaFileUrl]; ok {
				delete(fileMap, mediaFileUrl)
			}
		}
	}

	// delete trash file
	for fileUrl, _ := range fileMap {
		var err error
		err = p.Oss.DeleteMediaFile(fileUrl)
		if err != nil {
			fmt.Println("delete "+fileUrl+" fail: ", err.Error())
		}
	}
}

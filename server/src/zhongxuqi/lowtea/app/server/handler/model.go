package handler

import (
	"net/http"
	"strconv"

	"gopkg.in/mgo.v2/bson"

	"labix.org/v2/mgo"

	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"errors"
	"sync"
	"time"
	"zhongxuqi/lowtea/config"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"
)

var (
	ERROR_TIME_EXPIRED    = errors.New("time expired")
	ERROR_TOKEN_INVALID   = errors.New("token is invalid")
	ERROR_SESSION_INVALID = errors.New("session is invalid")
)

// MainHandler ...
type MainHandler struct {
	Mux          *http.ServeMux
	SessMap      map[string]int64
	SessMapMutex *sync.Mutex
	Config       model.Config
	UserColl     *mgo.Collection
	ReqisterColl *mgo.Collection
}

// New new MainHandler
func New() (handler *MainHandler) {
	handler = &MainHandler{
		Mux:          http.NewServeMux(),
		SessMap:      make(map[string]int64, 0),
		SessMapMutex: &sync.Mutex{},
	}

	// GC for session
	go func() {
		for {
			handler.SessMapMutex.Lock()
			keys := make([]string, 0)
			now := time.Now().Unix()
			for k, v := range handler.SessMap {
				if v < now {
					keys = append(keys, k)
				}
			}
			for _, k := range keys {
				delete(handler.SessMap, k)
			}
			handler.SessMapMutex.Unlock()

			time.Sleep(5 * time.Minute)
		}
	}()
	return
}

// CheckSession check the session of request
func (p *MainHandler) CheckSession(w http.ResponseWriter, r *http.Request) (err error) {
	var tokenCookie, accountCookie *http.Cookie
	tokenCookie, err = r.Cookie("token")
	p.SessMapMutex.Lock()
	if expireTime, ok := p.SessMap[tokenCookie.Value]; !ok || expireTime < time.Now().Unix() {
		err = ERROR_SESSION_INVALID
		return
	} else if expireTime-time.Now().Unix() < config.SESSION_UPDATE_TIME {
		accountCookie, err = r.Cookie("account")
		p.UpdateSession(w, accountCookie.Value)
	}
	p.SessMapMutex.Unlock()
	return
}

func (p *MainHandler) getSignStr(account string, expireTime int64) (rawStr string, err error) {
	rawStr = ""
	if account == model.ROOT {
		rawStr += model.ROOT + p.Config.RootPassword + strconv.FormatInt(expireTime, 10)
	} else {
		var user model.User
		err = p.UserColl.Find(bson.M{"account": account}).One(&user)
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
	if hex.EncodeToString(md5.New().Sum([]byte(rawStr))[:]) != sign {
		err = ERROR_TOKEN_INVALID
	}
	return
}

// CalculateSign calculate the sign
func (p *MainHandler) CalculateSign(account string, expireTime int64) (ret string, err error) {
	var rawStr string
	rawStr, err = p.getSignStr(account, expireTime)
	return hex.EncodeToString(md5.New().Sum([]byte(rawStr))[:]), err
}

// UpdateSession update the session of http header
func (p *MainHandler) UpdateSession(w http.ResponseWriter, account string) {
	expireTime := time.Now()
	expireTime.Add(config.EXPIRE_TIME)
	token, err := p.CalculateSign(account, expireTime.Unix())
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	accountCookie := &http.Cookie{
		Name:     "account",
		Value:    account,
		Path:     "/",
		Expires:  expireTime,
		HttpOnly: true,
	}
	w.Header().Set("Set-Cookie", accountCookie.String())
	tokenCookie := &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		Expires:  expireTime,
		HttpOnly: true,
	}
	w.Header().Set("Set-Cookie", tokenCookie.String())
	p.SessMap[token] = expireTime.Unix()
}

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
		http.Error(w, "[Login] check sign fail: "+err.Error(), 400)
		return
	}

	// if pass check sign, update session
	p.UpdateSession(w, dataStruct.Account)

	var user *model.User
	if user.Account == model.ROOT {
		user = &model.User{
			Account:  model.ROOT,
			NickName: model.ROOT,
			Role:     model.ROOT,
		}
	}

	var ret struct {
		User *model.User `json:"user"`
	}
	ret.User = user

	retStr, _ := json.Marshal(ret)
	w.WriteHeader(200)
	w.Write(retStr)
}

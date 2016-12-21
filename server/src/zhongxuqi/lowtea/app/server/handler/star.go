package handler

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"
	"zhongxuqi/lowtea/errors"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"

	"gopkg.in/mgo.v2/bson"
)

func (p *MainHandler) ActionStarDocuments(w http.ResponseWriter, r *http.Request) {
	var accountCookie *http.Cookie
	var err error
	accountCookie, err = r.Cookie("account")
	if err != nil {
		http.Error(w, "cookie find error: "+err.Error(), 400)
		return
	}

	if r.Method == http.MethodGet {
		err = r.ParseForm()
		if err != nil {
			http.Error(w, "parse form error: "+err.Error(), 400)
			return
		}

		var respBody struct {
			model.RespBase
			Documents []*model.Document `json:"documents"`
			DocTotal  int               `json:"docTotal"`
		}

		filter := bson.M{
			"account": accountCookie.Value,
		}

		var n int
		n, err = p.StarColl.Find(&filter).Count()
		if err != nil {
			http.Error(w, "find document count error: "+err.Error(), 500)
			return
		}
		respBody.DocTotal = n

		stars := make([]model.Star, 0)
		p.StarColl.Find(filter).Sort("-createTime").All(&stars)
		respBody.Documents = make([]*model.Document, 0, len(stars))
		for _, star := range stars {
			var document model.Document
			err = p.DocumentColl.Find(&bson.M{"_id": bson.ObjectIdHex(star.DocumentId)}).One(&document)

			n, _ = p.StarColl.Find(&bson.M{"documentId": document.Id.Hex()}).Count()
			document.StarNum = n

			respBody.Documents = append(respBody.Documents, &document)
		}
		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
	return
}

func (p *MainHandler) ActionStar(w http.ResponseWriter, r *http.Request) {
	var accountCookie *http.Cookie
	var err error
	accountCookie, err = r.Cookie("account")
	if err != nil {
		http.Error(w, "cookie find error: "+err.Error(), 400)
		return
	}

	if r.Method == http.MethodPost {
		cmds := strings.Split(r.URL.Path, "/")
		if len(cmds) < 4 {
			http.Error(w, errors.ERROR_EMPTY_ID.Error(), 400)
			return
		}
		documentId := cmds[4]
		if !bson.IsObjectIdHex(documentId) {
			http.Error(w, errors.ERROR_INVAIL_ID.Error(), 400)
			return
		}

		var reqData struct {
			Action string `json:"action"`
		}
		utils.ReadReq2Struct(r, &reqData)
		if reqData.Action == "star" {
			_, err := p.StarColl.Upsert(&bson.M{"account": accountCookie.Value, "documentId": documentId}, &bson.M{
				"$set": bson.M{
					"account":    accountCookie.Value,
					"documentId": documentId,
					"createTime": time.Now().Unix(),
				},
			})
			if err != nil {
				http.Error(w, "upsert error: "+err.Error(), 500)
				return
			}
		} else if reqData.Action == "unstar" {
			_, err := p.StarColl.RemoveAll(&bson.M{"account": accountCookie.Value, "documentId": documentId})
			if err != nil {
				http.Error(w, "remove error: "+err.Error(), 500)
				return
			}
		}

		var respBody struct {
			model.RespBase
			StarNum int `json:"starNum"`
		}
		respBody.StarNum, err = p.StarColl.Find(&bson.M{"documentId": documentId}).Count()
		if err != nil {
			http.Error(w, "find error: "+err.Error(), 500)
			return
		}
		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
	return
}

package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"
	"zhongxuqi/lowtea/errors"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"

	"gopkg.in/mgo.v2/bson"
)

func (p *MainHandler) ActionDocuments(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		var accountCookie *http.Cookie
		var err error
		accountCookie, err = r.Cookie("account")
		if err != nil {
			http.Error(w, "cookie find error: "+err.Error(), 400)
			return
		}

		err = r.ParseForm()
		if err != nil {
			http.Error(w, "parse url form error: "+err.Error(), 400)
			return
		}

		var params struct {
			PageSize  int `json:"pageSize"`
			PageIndex int `json:"pageIndex"`

			Account     string `json:"account"`
			LikeAccount string `json:"likeAccount"`
		}
		params.PageSize, err = strconv.Atoi(r.Form.Get("pageSize"))
		if err != nil {
			http.Error(w, "read param pageSize error: "+err.Error(), 400)
			return
		}
		params.PageIndex, err = strconv.Atoi(r.Form.Get("pageIndex"))
		if err != nil {
			http.Error(w, "read param pageIndex error: "+err.Error(), 400)
			return
		}

		var respBody struct {
			model.RespBase
			Documents []model.Document `json:"documents"`
			PageTotal int              `json:"pageTotal"`
			DocTotal  int              `json:"docTotal"`
		}
		filter := bson.M{
			"$or": []bson.M{
				bson.M{"account": accountCookie.Value, "status": bson.M{"$ne": model.STATUS_DRAFT}},
				bson.M{"status": model.STATUS_PUBLISH_MEMBER},
				bson.M{"status": model.STATUS_PUBLISH_PUBLIC},
			},
		}
		if params.Account != "" {
			filter["account"] = params.Account
		}

		var n int
		n, err = p.DocumentColl.Find(filter).Count()
		if err != nil {
			http.Error(w, "find document count error: "+err.Error(), 500)
			return
		}
		respBody.DocTotal = n
		if n > 0 {
			respBody.PageTotal = (n-1)/params.PageSize + 1
		} else {
			respBody.PageTotal = 0
		}

		err = p.DocumentColl.Find(&filter).Sort("-createTime").Skip(params.PageSize * params.PageIndex).Limit(params.PageSize).All(&respBody.Documents)
		if err != nil {
			http.Error(w, "find documents error: "+err.Error(), 500)
			return
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

func (p *MainHandler) ActionDocument(w http.ResponseWriter, r *http.Request) {
	var accountCookie *http.Cookie
	var err error
	accountCookie, err = r.Cookie("account")
	if err != nil {
		http.Error(w, "cookie find error: "+err.Error(), 400)
		return
	}

	if r.Method == http.MethodPost {
		var reqData struct {
			Action   string         `json:"action"`
			Document model.Document `json:"document"`
		}
		utils.ReadReq2Struct(r, &reqData)

		if len(reqData.Document.Title) == 0 {
			http.Error(w, errors.ERROR_EMPTY_TITLE.Error(), 400)
			return
		}

		if reqData.Action == "add" {
			reqData.Document.Account = accountCookie.Value
			reqData.Document.CreateTime = time.Now().Unix()
			reqData.Document.ModifyTime = time.Now().Unix()
			reqData.Document.Status = model.STATUS_DRAFT
			documentByte, _ := bson.Marshal(&reqData.Document)
			documentBson := make(bson.M, 0)
			bson.Unmarshal(documentByte, &documentBson)
			delete(documentBson, "_id")
			p.DocumentColl.Upsert(documentBson, bson.M{"$set": documentBson})

			var document model.Document
			p.DocumentColl.Find(documentBson).One(&document)

			var respBody struct {
				Status  int           `json:"status"`
				Message string        `json:"message"`
				Id      bson.ObjectId `json:"id"`
			}
			respBody.Status = 200
			respBody.Message = "success"
			respBody.Id = document.Id
			respByte, _ := json.Marshal(&respBody)
			w.Write(respByte)
			return
		} else if reqData.Action == "edit" {
			var document model.Document
			err = p.DocumentColl.Find(bson.M{"_id": reqData.Document.Id}).One(&document)
			if err != nil {
				http.Error(w, "document find error: "+err.Error(), 400)
				return
			}
			if document.Account != accountCookie.Value {
				http.Error(w, errors.ERROR_PERMISSION_DENIED.Error(), 401)
				return
			}
			p.DocumentColl.Update(bson.M{"_id": reqData.Document.Id}, bson.M{
				"$set": bson.M{
					"title":      reqData.Document.Title,
					"content":    reqData.Document.Content,
					"modifyTime": time.Now().Unix(),
					"status":     reqData.Document.Status,
				},
			})

			var respBody struct {
				Status  int           `json:"status"`
				Message string        `json:"message"`
				Id      bson.ObjectId `json:"id"`
			}
			respBody.Status = 200
			respBody.Message = "success"
			respBody.Id = reqData.Document.Id
			respByte, _ := json.Marshal(&respBody)
			w.Write(respByte)
			return
		}
	} else if r.Method == http.MethodDelete {
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
		var document model.Document
		err := p.DocumentColl.Find(bson.M{"_id": bson.ObjectIdHex(documentId)}).One(&document)
		if err != nil {
			http.Error(w, "find document error: "+err.Error(), 500)
			return
		}
		if accountCookie.Value != model.ROOT && accountCookie.Value != document.Account {
			http.Error(w, errors.ERROR_PERMISSION_DENIED.Error(), 400)
			return
		}

		_, err = p.DocumentColl.RemoveAll(bson.M{"_id": bson.ObjectIdHex(documentId)})
		if err != nil {
			http.Error(w, "remove document error: "+err.Error(), 500)
			return
		}

		respByte, _ := json.Marshal(&model.RespBase{
			Status:  200,
			Message: "success",
		})
		w.Write(respByte)
		return
	} else if r.Method == http.MethodGet {
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
		var respBody struct {
			model.RespBase
			Document model.Document `json:"document"`
		}
		err := p.DocumentColl.Find(bson.M{"_id": bson.ObjectIdHex(documentId)}).One(&respBody.Document)
		if err != nil {
			http.Error(w, "find document error: "+err.Error(), 500)
			return
		}

		if respBody.Document.Status == model.STATUS_DRAFT && accountCookie.Value != respBody.Document.Account {
			http.Error(w, errors.ERROR_PERMISSION_DENIED.Error(), 400)
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

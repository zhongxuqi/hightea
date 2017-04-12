package handler

import (
	"encoding/json"
	"net/http"
	"sort"
	"strings"
	"zhongxuqi/lowtea/errors"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func (p *MainHandler) ActionFlag(w http.ResponseWriter, r *http.Request) {
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

		err = p.FlagModel.ClearExpiredFlags()
		if err != nil {
			http.Error(w, "remove old flag error: "+err.Error(), 500)
			return
		}

		if reqData.Action == "flag" {
			err = p.FlagModel.Insert(accountCookie.Value, documentId)
			if err != nil {
				http.Error(w, "upsert error: "+err.Error(), 500)
				return
			}
		} else if reqData.Action == "unflag" {
			p.FlagModel.RemoveByAccountAndDocumentId(accountCookie.Value, documentId)
		}

		var respBody struct {
			model.RespBase
			FlagNum int `json:"flagNum"`
		}
		respBody.FlagNum, err = p.FlagModel.CountByDocumentId(documentId)
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

type flagDocuments []*model.Document

func (p flagDocuments) Len() int {
	return len(p)
}

func (p flagDocuments) Less(i, j int) bool {
	if p[i].FlagNum == p[j].FlagNum {
		return p[i].CreateTime > p[j].CreateTime
	}
	return p[i].FlagNum > p[j].FlagNum
}

func (p flagDocuments) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}

func (p *MainHandler) ActionTopFlagDocuments(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		var respBody struct {
			Documents flagDocuments `json:"documents"`
			AdminNum  int           `json:"adminNum"`
		}
		documentIds, err := p.FlagModel.ListDocumentIds()
		if err != nil {
			http.Error(w, "find distinct documentId error: "+err.Error(), 500)
			return
		}

		respBody.AdminNum, err = p.UserModel.CountByRole(model.ADMIN)
		if err != nil {
			http.Error(w, "find users count error: "+err.Error(), 500)
			return
		}
		respBody.AdminNum++

		respBody.Documents = flagDocuments{}
		for _, documentId := range documentIds {
			var flagdoc model.Document
			flagdoc, err = p.DocumentModel.FindDocumentWithSelector(bson.ObjectIdHex(documentId), bson.M{
				"_id":        1,
				"title":      1,
				"modifyTime": 1,
				"status":     1,
				"account":    1,
			})
			if err != nil {
				if err == mgo.ErrNotFound {
					p.FlagModel.RemoveByDocumentId(documentId)
				}
				continue
			}
			flagdoc.FlagNum, _ = p.FlagModel.CountByDocumentId(documentId)
			flagdoc.StarNum, _ = p.StarModel.CountByDocumentId(documentId)
			respBody.Documents = append(respBody.Documents, &flagdoc)
		}
		sort.Sort(respBody.Documents)

		if len(respBody.Documents) > 10 {
			respBody.Documents = respBody.Documents[0:10]
		}

		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
}

func (p *MainHandler) ActionPublicTopFlagDocuments(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		var respBody struct {
			Documents flagDocuments `json:"documents"`
			AdminNum  int           `json:"adminNum"`
		}
		documentIds, err := p.FlagModel.ListDocumentIds()
		if err != nil {
			http.Error(w, "find distinct documentId error: "+err.Error(), 500)
			return
		}

		respBody.AdminNum, err = p.UserModel.CountByRole(model.ADMIN)
		if err != nil {
			http.Error(w, "find users count error: "+err.Error(), 500)
			return
		}
		respBody.AdminNum++

		respBody.Documents = flagDocuments{}
		for _, documentId := range documentIds {
			var flagdoc model.Document
			flagdoc, err = p.DocumentModel.FindByFilter(bson.M{
				"_id":    bson.ObjectIdHex(documentId),
				"status": model.STATUS_PUBLISH_PUBLIC,
			})
			if err != nil {
				if err == mgo.ErrNotFound {
					p.FlagModel.RemoveByDocumentId(documentId)
				}
				continue
			}
			flagdoc.FlagNum, _ = p.FlagModel.CountByDocumentId(documentId)
			respBody.Documents = append(respBody.Documents, &flagdoc)
		}
		sort.Sort(respBody.Documents)

		if len(respBody.Documents) > 10 {
			respBody.Documents = respBody.Documents[0:10]
		}

		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
}

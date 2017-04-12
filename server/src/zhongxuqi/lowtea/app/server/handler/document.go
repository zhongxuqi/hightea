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
			PageSize  int    `json:"pageSize"`
			PageIndex int    `json:"pageIndex"`
			Account   string `json:"account"`
			Keyword   string `json:"keyword"`
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
		params.Account = r.Form.Get("account")
		params.Keyword = r.Form.Get("keyword")

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
		if params.Keyword != "" {
			filter["title"] = &bson.M{
				"$regex": params.Keyword,
			}
		}

		var n int
		n, err = p.DocumentModel.CountByFilter(filter)
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

		respBody.Documents, err = p.DocumentModel.SortFindByFilterAndSelecterWithPage(filter, bson.M{
			"_id":        1,
			"title":      1,
			"modifyTime": 1,
			"status":     1,
			"account":    1,
		}, "-modifyTime", params.PageSize*params.PageIndex, params.PageSize)
		if err != nil {
			http.Error(w, "find documents error: "+err.Error(), 500)
			return
		}

		for i, _ := range respBody.Documents {
			respBody.Documents[i].StarNum, _ = p.StarModel.CountByDocumentId(respBody.Documents[i].Id.Hex())
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
			p.DocumentModel.Insert(reqData.Document)

			var document model.Document
			document, err = p.DocumentModel.FindByTimeAccountTitleContent(reqData.Document.ModifyTime, accountCookie.Value,
				reqData.Document.Title, reqData.Document.Content)
			if err != nil {
				http.Error(w, "find document error: "+err.Error(), 400)
				return
			}

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
			document, err = p.DocumentModel.FindDocument(reqData.Document.Id)
			if err != nil {
				http.Error(w, "document find error: "+err.Error(), 400)
				return
			}
			if document.Account != accountCookie.Value {
				http.Error(w, errors.ERROR_PERMISSION_DENIED.Error(), 401)
				return
			}
			err = p.DocumentModel.UpdateDocument(reqData.Document.Id, bson.M{
				"title":      reqData.Document.Title,
				"content":    reqData.Document.Content,
				"modifyTime": time.Now().Unix(),
				"status":     reqData.Document.Status,
			})
			if err != nil {
				http.Error(w, "document update error: "+err.Error(), 400)
				return
			}

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
		document, err = p.DocumentModel.FindDocument(bson.ObjectIdHex(documentId))
		if err != nil {
			http.Error(w, "find document error: "+err.Error(), 500)
			return
		}
		if accountCookie.Value != model.ROOT && accountCookie.Value != document.Account {
			http.Error(w, errors.ERROR_PERMISSION_DENIED.Error(), 400)
			return
		}

		err = p.StarModel.RemoveByDocumentId(documentId)
		if err != nil {
			http.Error(w, "remove document star error: "+err.Error(), 500)
			return
		}
		err = p.FlagModel.RemoveByDocumentId(documentId)
		if err != nil {
			http.Error(w, "remove document flag error: "+err.Error(), 500)
			return
		}
		err = p.DocumentModel.Remove(bson.ObjectIdHex(documentId))
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
		if len(cmds) < 5 {
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
			Star     bool           `json:"star"`
			Flag     bool           `json:"flag"`
		}
		var err error
		respBody.Document, err = p.DocumentModel.FindDocument(bson.ObjectIdHex(documentId))
		if err != nil {
			http.Error(w, "find document error: "+err.Error(), 500)
			return
		}

		if respBody.Document.Status == model.STATUS_DRAFT && accountCookie.Value != respBody.Document.Account {
			http.Error(w, errors.ERROR_PERMISSION_DENIED.Error(), 400)
			return
		}

		var n int
		n, _ = p.StarModel.CountByAccountAndDocumentId(accountCookie.Value, documentId)
		if n > 0 {
			respBody.Star = true
		} else {
			respBody.Star = false
		}

		n, _ = p.FlagModel.CountByAccountAndDocumentId(accountCookie.Value, documentId)
		if n > 0 {
			respBody.Flag = true
		} else {
			respBody.Flag = false
		}

		n, _ = p.StarModel.CountByDocumentId(documentId)
		respBody.Document.StarNum = n
		n, _ = p.FlagModel.CountByDocumentId(documentId)
		respBody.Document.FlagNum = n

		respBody.Status = 200
		respBody.Message = "success"
		respByte, _ := json.Marshal(&respBody)
		w.Write(respByte)
		return
	}
	http.Error(w, "Not Found", 404)
	return
}

func (p *MainHandler) ActionDocumentStatus(w http.ResponseWriter, r *http.Request) {
	var accountCookie *http.Cookie
	var err error
	accountCookie, err = r.Cookie("account")
	if err != nil {
		http.Error(w, "cookie find error: "+err.Error(), 400)
		return
	}

	if r.Method == http.MethodPost {
		var reqData struct {
			Document model.Document `json:"document"`
		}
		utils.ReadReq2Struct(r, &reqData)

		var document model.Document
		document, err = p.DocumentModel.FindDocument(reqData.Document.Id)
		if err != nil {
			http.Error(w, "document find error: "+err.Error(), 400)
			return
		}
		if document.Account != accountCookie.Value {
			http.Error(w, errors.ERROR_PERMISSION_DENIED.Error(), 401)
			return
		}
		err = p.DocumentModel.UpdateDocument(reqData.Document.Id, bson.M{
			"status": reqData.Document.Status,
		})
		if err != nil {
			http.Error(w, "document update error: "+err.Error(), 500)
			return
		}

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
	http.Error(w, "Not Found", 404)
}

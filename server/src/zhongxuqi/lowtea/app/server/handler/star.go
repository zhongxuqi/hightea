package handler

import (
	"encoding/json"
	"net/http"
	"sort"
	"strings"
	"time"
	"zhongxuqi/lowtea/errors"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"

	"gopkg.in/mgo.v2"
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

		stars := make([]model.Star, 0)
		p.StarColl.Find(filter).Sort("-createTime").All(&stars)
		respBody.Documents = make([]*model.Document, 0, len(stars))
		for _, star := range stars {
			var document model.Document
			document, err = p.DocumentModel.FindDocumentWithSelector(bson.ObjectIdHex(star.DocumentId), bson.M{
				"_id":        1,
				"title":      1,
				"modifyTime": 1,
				"status":     1,
				"account":    1,
			})
			if err != nil {
				if err == mgo.ErrNotFound {
					p.StarColl.RemoveAll(&bson.M{"_id": bson.ObjectIdHex(star.DocumentId)})
				}
				continue
			}

			n, _ = p.StarColl.Find(&bson.M{"documentId": document.Id.Hex()}).Count()
			document.StarNum = n

			respBody.Documents = append(respBody.Documents, &document)
		}
		respBody.DocTotal = len(respBody.Documents)
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

type starDocuments []*model.Document

func (p starDocuments) Len() int {
	return len(p)
}

func (p starDocuments) Less(i, j int) bool {
	if p[i].StarNum == p[j].StarNum {
		return p[i].CreateTime > p[j].CreateTime
	}
	return p[i].StarNum > p[j].StarNum
}

func (p starDocuments) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}

func (p *MainHandler) ActionTopStarDocuments(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		var respBody struct {
			Documents starDocuments `json:"documents"`
			MemberNum int           `json:"memberNum"`
		}
		documentIds := make([]string, 0)
		err := p.StarColl.Find(&bson.M{}).Distinct("documentId", &documentIds)
		if err != nil {
			http.Error(w, "find distinct documentId error: "+err.Error(), 500)
			return
		}

		respBody.MemberNum, err = p.UserModel.Count()
		if err != nil {
			http.Error(w, "find users count error: "+err.Error(), 500)
			return
		}
		respBody.MemberNum++

		respBody.Documents = starDocuments{}
		for _, documentId := range documentIds {
			var stardoc model.Document
			stardoc, err = p.DocumentModel.FindDocumentWithSelector(bson.ObjectIdHex(documentId), bson.M{
				"_id":        1,
				"title":      1,
				"modifyTime": 1,
				"status":     1,
				"account":    1,
			})
			if err != nil {
				if err == mgo.ErrNotFound {
					p.StarColl.RemoveAll(&bson.M{"_id": bson.ObjectIdHex(documentId)})
				}
				continue
			}
			stardoc.StarNum, _ = p.StarColl.Find(&bson.M{"documentId": documentId}).Count()
			respBody.Documents = append(respBody.Documents, &stardoc)
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

func (p *MainHandler) ActionUserTopStarDocuments(w http.ResponseWriter, r *http.Request) {
	var err error

	if r.Method == http.MethodGet {
		err = r.ParseForm()
		if err != nil {
			http.Error(w, "parse url form error: "+err.Error(), 400)
			return
		}

		account := r.Form.Get("account")

		var respBody struct {
			Documents starDocuments `json:"documents"`
			MemberNum int           `json:"memberNum"`
		}
		documentIds := make([]string, 0)
		err := p.StarColl.Find(&bson.M{}).Distinct("documentId", &documentIds)
		if err != nil {
			http.Error(w, "find distinct documentId error: "+err.Error(), 500)
			return
		}

		respBody.MemberNum, err = p.UserModel.Count()
		if err != nil {
			http.Error(w, "find users count error: "+err.Error(), 500)
			return
		}
		respBody.MemberNum++

		respBody.Documents = starDocuments{}
		for _, documentId := range documentIds {
			var stardoc model.Document
			stardoc, err = p.DocumentModel.FindByFilterWithSelector(bson.M{
				"_id":     bson.ObjectIdHex(documentId),
				"account": account,
			}, bson.M{
				"_id":        1,
				"title":      1,
				"modifyTime": 1,
				"status":     1,
				"account":    1,
			})
			if err != nil {
				if err == mgo.ErrNotFound {
					p.StarColl.RemoveAll(&bson.M{"_id": bson.ObjectIdHex(documentId)})
				}
				continue
			}
			stardoc.StarNum, _ = p.StarColl.Find(&bson.M{"documentId": documentId}).Count()
			respBody.Documents = append(respBody.Documents, &stardoc)
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

func (p *MainHandler) ActionPublicTopStarDocuments(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		var respBody struct {
			Documents starDocuments `json:"documents"`
			MemberNum int           `json:"memberNum"`
		}
		documentIds := make([]string, 0)
		err := p.StarColl.Find(&bson.M{}).Distinct("documentId", &documentIds)
		if err != nil {
			http.Error(w, "find distinct documentId error: "+err.Error(), 500)
			return
		}

		respBody.MemberNum, err = p.UserModel.Count()
		if err != nil {
			http.Error(w, "find users count error: "+err.Error(), 500)
			return
		}
		respBody.MemberNum++

		respBody.Documents = starDocuments{}
		for _, documentId := range documentIds {
			var stardoc model.Document
			stardoc, err = p.DocumentModel.FindByFilter(bson.M{
				"_id":    bson.ObjectIdHex(documentId),
				"status": model.STATUS_PUBLISH_PUBLIC,
			})
			if err != nil {
				if err == mgo.ErrNotFound {
					p.StarColl.RemoveAll(&bson.M{"_id": bson.ObjectIdHex(documentId)})
				}
				continue
			}
			stardoc.StarNum, _ = p.StarColl.Find(&bson.M{"documentId": documentId}).Count()
			respBody.Documents = append(respBody.Documents, &stardoc)
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

package model

import (
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Star struct {
	Id         bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Account    string        `json:"account" bson:"account"`
	DocumentId string        `json:"documentId" bson:"documentId"`
	CreateTime int64         `json:"createTime" bson:"createTime"`
}

type StarModel struct {
	coll *mgo.Collection
}

func NewStarModel(db *mgo.Database) (starModal *StarModel) {
	coll := db.C("stars")
	coll.EnsureIndexKey("account", "documentId")
	return &StarModel{
		coll: coll,
	}
}

func (p *StarModel) CountByDocumentId(documentId string) (n int, err error) {
	n, err = p.coll.Find(&bson.M{"documentId": documentId}).Count()
	return
}

func (p *StarModel) RemoveByAccount(account string) (err error) {
	_, err = p.coll.RemoveAll(bson.M{"account": account})
	return
}

func (p *StarModel) RemoveByDocumentId(documentId string) (err error) {
	_, err = p.coll.RemoveAll(bson.M{"documentId": documentId})
	return
}

func (p *StarModel) RemoveByAccountAndDocumentId(account, documentId string) (err error) {
	_, err = p.coll.RemoveAll(bson.M{"account": account, "documentId": documentId})
	return
}

func (p *StarModel) CountByAccountAndDocumentId(account, documentId string) (n int, err error) {
	n, err = p.coll.Find(&bson.M{"account": account, "documentId": documentId}).Count()
	return
}

func (p *StarModel) CountByAccount(account string) (n int, err error) {
	n, err = p.coll.Find(bson.M{"account": account}).Count()
	return
}

func (p *StarModel) SortListByAccount(account, sorter string) (stars []Star, err error) {
	stars = make([]Star, 0)
	err = p.coll.Find(bson.M{"account": account}).Sort(sorter).All(&stars)
	return
}

func (p *StarModel) Insert(account, documentId string) (err error) {
	_, err = p.coll.Upsert(&bson.M{"account": account, "documentId": documentId}, &bson.M{
		"$set": bson.M{
			"account":    account,
			"documentId": documentId,
			"createTime": time.Now().Unix(),
		},
	})
	return
}

func (p *StarModel) ListDocumentIds() (documentIds []string, err error) {
	documentIds = make([]string, 0)
	err = p.coll.Find(nil).Distinct("documentId", &documentIds)
	return
}

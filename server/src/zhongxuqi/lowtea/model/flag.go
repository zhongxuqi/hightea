package model

import (
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type Flag struct {
	Id         bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Account    string        `json:"account" bson:"account"`
	DocumentId string        `json:"documentId" bson:"documentId"`
	CreateTime int64         `json:"createTime" bson:"createTime"`
}

type FlagModel struct {
	coll            *mgo.Collection
	flagExpiredTime *int64
}

func NewFlagModel(db *mgo.Database, flagExpiredTime *int64) (flagModel *FlagModel) {
	coll := db.C("flags")
	coll.EnsureIndexKey("createTime", "account", "documentId")
	return &FlagModel{
		coll:            coll,
		flagExpiredTime: flagExpiredTime,
	}
}

func (p *FlagModel) RemoveByAccount(account string) (err error) {
	_, err = p.coll.RemoveAll(bson.M{"account": account})
	return
}

func (p *FlagModel) RemoveByDocumentId(documentId string) (err error) {
	_, err = p.coll.RemoveAll(bson.M{"documentId": documentId})
	return
}

func (p *FlagModel) RemoveByAccountAndDocumentId(account, documentId string) (err error) {
	_, err = p.coll.RemoveAll(bson.M{"account": account, "documentId": documentId})
	return
}

func (p *FlagModel) CountByDocumentId(documentId string) (n int, err error) {
	n, err = p.coll.Find(&bson.M{
		"documentId": documentId,
		"createTime": bson.M{"$gte": time.Now().Unix() - *(p.flagExpiredTime)},
	}).Count()
	return
}

func (p *FlagModel) CountByAccountAndDocumentId(account, documentId string) (n int, err error) {
	n, err = p.coll.Find(&bson.M{
		"account":    account,
		"documentId": documentId,
		"createTime": bson.M{"$gte": time.Now().Unix() - *(p.flagExpiredTime)},
	}).Count()
	return
}

func (p *FlagModel) ClearExpiredFlags() (err error) {
	_, err = p.coll.RemoveAll(&bson.M{"createTime": bson.M{"$lt": time.Now().Unix() - *(p.flagExpiredTime)}})
	return
}

func (p *FlagModel) Insert(account, documentId string) (err error) {
	_, err = p.coll.Upsert(&bson.M{"account": account, "documentId": documentId}, &bson.M{
		"$set": bson.M{
			"account":    account,
			"documentId": documentId,
			"createTime": time.Now().Unix(),
		},
	})
	return
}

func (p *FlagModel) ListDocumentIds() (documentIds []string, err error) {
	documentIds = make([]string, 0)
	err = p.coll.Find(&bson.M{
		"createTime": bson.M{"$gte": time.Now().Unix() - *(p.flagExpiredTime)},
	}).Distinct("documentId", &documentIds)
	return
}

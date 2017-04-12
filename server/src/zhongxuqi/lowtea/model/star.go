package model

import "gopkg.in/mgo.v2/bson"
import "gopkg.in/mgo.v2"

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
	return &StarModel{
		coll: db.C("stars"),
	}
}

func (p *StarModel) CountByDocumentId(documentId string) (n int, err error) {
	n, err = p.coll.Find(&bson.M{"documentId": documentId}).Count()
	return
}

func (p *StarModel) RemoveByDocumentId(documentId string) (err error) {
	_, err = p.coll.RemoveAll(bson.M{"documentId": documentId})
	return
}

func (p *StarModel) CountByAccountAndDocumentId(account, documentId string) (n int, err error) {
	n, err = p.coll.Find(&bson.M{"account": account, "documentId": documentId}).Count()
	return
}

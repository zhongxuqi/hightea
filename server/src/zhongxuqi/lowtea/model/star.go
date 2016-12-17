package model

import "gopkg.in/mgo.v2/bson"

type Star struct {
	Id         bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Account    string        `json:"account" bson:"account"`
	DocumentId string        `json:"documentId" bson:"documentId"`
	CreateTime int64         `json:"createTime" bson:"createTime"`
}

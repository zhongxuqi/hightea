package model

import "gopkg.in/mgo.v2/bson"

const (
	STATUS_DRAFT          = "status_draft"
	STATUS_PUBLISH_SELF   = "status_publish_self"
	STATUS_PUBLISH_MEMBER = "status_publish_member"
	STATUS_PUBLISH_PUBLIC = "status_publish_public"
)

type Document struct {
	Id         bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Title      string        `json:"title" bson:"title"`
	Content    string        `json:"content" bson:"content"`
	CreateTime int64         `json:"createTime" bson:"createTime"`
	ModifyTime int64         `json:"modifyTime" bson:"modifyTime"`
	Account    string        `json:"account" bson:"account"`
	Status     string        `json:"status" bson:"status"`
	StarNum    int           `json:"starNum" bson:"starNum"`
}

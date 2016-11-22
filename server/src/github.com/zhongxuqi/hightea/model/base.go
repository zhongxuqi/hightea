package model

import "gopkg.in/mgo.v2/bson"

// BaseObj ...
type BaseObj struct {
	ID bson.ObjectId `json:"id" bson:"_id"`
}

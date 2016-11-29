package model

import "gopkg.in/mgo.v2/bson"

// BaseMgo base struct for mongo bson
type BaseMgo struct {
	ID bson.ObjectId `json:"id" bson:"_id"`
}

package model

import "gopkg.in/mgo.v2/bson"

// MgoBase base struct for mongo bson
type MgoBase struct {
	ID bson.ObjectId `json:"id" bson:"_id"`
}

// RespBase base struct for http response
type RespBase struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

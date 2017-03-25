package model

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const (
	COLL_SESSION = "sessions"
)

type Session struct {
	Token       string `json:"token" bson:"token"`
	ExpiredTime int64  `json:"expired_time" bson:"expired_time"`
}

type SessionModel struct {
	coll *mgo.Collection
}

func NewSessionModel(db *mgo.Database) *SessionModel {
	coll := db.C(COLL_SESSION)
	coll.EnsureIndexKey("token", "expired_time")
	return &SessionModel{
		coll: coll,
	}
}

func (s *SessionModel) ClearSessionByLimitTime(limitTime int64) (err error) {
	_, err = s.coll.RemoveAll(&bson.M{"expired_time": bson.M{"$lt": limitTime}})
	return
}

func (s *SessionModel) GetSessionByToken(token string) (ret Session, err error) {
	err = s.coll.Find(&bson.M{"token": token}).One(&ret)
	return
}

func (s *SessionModel) InsertSession(token string, expiredTime int64) (err error) {
	err = s.coll.Insert(Session{
		Token:       token,
		ExpiredTime: expiredTime,
	})
	return
}

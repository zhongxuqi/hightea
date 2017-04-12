package model

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

const (
	LOCAL = "local"
	QINIU = "qiniu"
)

// Config env of the server
type Config struct {
	ServerAddr      string    `json:"server_addr"`
	RootEmail       string    `json:"rootemail"`
	RootPassword    string    `json:"rootpassword"`
	RootLanguage    string    `json:"rootlanguage"`
	DBConfig        DBConfig  `json:"dbConfig"`
	OssConfig       OSSConfig `json:"ossConfig"`
	FlagExpiredTime int64     `json:"-"`
}

// DBConfig env of the db
type DBConfig struct {
	Host         string `json:"host"`
	User         string `json:"user"`
	Password     string `json:"password"`
	DBName       string `json:"dbname"`
	UserColl     string `json:"userColl"`
	RegisterColl string `json:"reqisterColl"`
	DocumentColl string `json:"documentColl"`
	StarColl     string `json:"starColl"`
	FlagColl     string `json:"flagColl"`
}

type OSSConfig struct {
	OssProvider string `json:"ossProvider"`
	MediaPath   string `json:"mediaPath"`
}

type AppConfig struct {
	App             string `json:"app" bson:"app"`
	Version         string `json:"version" bson:"version"`
	FlagExpiredTime int64  `json:"flagExpiredTime" bson:"flagExpiredTime"`
}

type AppConfigModel struct {
	coll *mgo.Collection
}

func NewAppConfigModel(db *mgo.Database) (ret *AppConfigModel) {
	return &AppConfigModel{
		coll: db.C("lowtea"),
	}
}

func (p *AppConfigModel) Init(appName, version string) (err error) {
	_, err = p.coll.Upsert(bson.M{"app": appName}, bson.M{"$set": bson.M{"version": version}})
	return
}

func (p *AppConfigModel) Update(appName string, filter bson.M) (err error) {
	err = p.coll.Update(bson.M{"app": appName}, bson.M{"$set": filter})
	return
}

func (p *AppConfigModel) Find(appName string) (appConfig AppConfig, err error) {
	err = p.coll.Find(bson.M{"app": appName}).One(&appConfig)
	return
}

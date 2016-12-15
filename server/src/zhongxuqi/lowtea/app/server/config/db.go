package config

import (
	"zhongxuqi/lowtea/app/server/handler"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// InitDB init the db env
func InitDB(mainHander *handler.MainHandler) {
	sess, err := mgo.Dial(mainHander.Config.DBConfig.Host)
	if err != nil {
		panic(err)
	}

	// do login
	if len(mainHander.Config.DBConfig.User) > 0 {
		err = sess.DB("admin").Login(mainHander.Config.DBConfig.User, mainHander.Config.DBConfig.Password)
		if err != nil {
			panic(err)
		}
	}

	// init db
	sess.DB(mainHander.Config.DBConfig.DBName).C(APPNAME).Upsert(
		bson.M{"app": APPNAME}, bson.M{"$set": bson.M{"version": VERSION}})

	mainHander.UserColl = sess.DB(mainHander.Config.DBConfig.DBName).C(mainHander.Config.DBConfig.UserColl)
	mainHander.RegisterColl = sess.DB(mainHander.Config.DBConfig.DBName).C(mainHander.Config.DBConfig.RegisterColl)
}

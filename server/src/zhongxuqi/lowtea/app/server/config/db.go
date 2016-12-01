package config

import (
	"labix.org/v2/mgo"

	"zhongxuqi/lowtea/app/server/handler"

	"labix.org/v2/mgo/bson"
)

// InitDB init the db env
func InitDB(mainHander *handler.MainHandler) {
	sess, err := mgo.Dial(mainHander.Config.DBConfig.Host)
	if err != nil {
		panic(err)
	}

	// init db
	sess.DB(mainHander.Config.DBConfig.DBName).C(APPNAME).Upsert(
		bson.M{"app": APPNAME}, bson.M{"$set": bson.M{"version": VERSION}})

	mainHander.UserColl = sess.DB(mainHander.Config.DBConfig.DBName).C(mainHander.Config.DBConfig.UserColl)
	mainHander.RegisterColl = sess.DB(mainHander.Config.DBConfig.DBName).C(mainHander.Config.DBConfig.RegisterColl)
}

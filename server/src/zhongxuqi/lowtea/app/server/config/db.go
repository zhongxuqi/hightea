package config

import (
	"zhongxuqi/lowtea/app/server/handler"
	"zhongxuqi/lowtea/model"

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
	mainHander.AppConfColl = sess.DB(mainHander.Config.DBConfig.DBName).C(APPNAME)
	mainHander.AppConfColl.Upsert(bson.M{"app": APPNAME}, bson.M{"$set": bson.M{"version": VERSION}})

	appConf := model.AppConfig{}
	err = mainHander.AppConfColl.Find(&bson.M{"app": APPNAME}).One(&appConf)
	if err != nil {
		panic(err)
	}

	if appConf.FlagExpiredTime <= 0 {
		mainHander.Config.FlagExpiredTime = FLAG_EXPIRED_TIME
		err = mainHander.AppConfColl.Update(&bson.M{"app": APPNAME}, &bson.M{"$set": bson.M{"flagExpiredTime": FLAG_EXPIRED_TIME}})
		if err != nil {
			panic(err)
		}
	} else {
		mainHander.Config.FlagExpiredTime = appConf.FlagExpiredTime
	}

	appDB := sess.DB(mainHander.Config.DBConfig.DBName)

	mainHander.UserColl = appDB.C(mainHander.Config.DBConfig.UserColl)
	mainHander.RegisterColl = appDB.C(mainHander.Config.DBConfig.RegisterColl)

	mainHander.DocumentColl = appDB.C(mainHander.Config.DBConfig.DocumentColl)
	mainHander.DocumentColl.EnsureIndexKey("createTime")

	mainHander.StarColl = appDB.C(mainHander.Config.DBConfig.StarColl)
	mainHander.StarColl.EnsureIndexKey("account", "documentId")

	mainHander.FlagColl = appDB.C(mainHander.Config.DBConfig.FlagColl)
	mainHander.FlagColl.EnsureIndexKey("createTime", "account", "documentId")

	// init session collection
	mainHander.SessModel = model.NewSessionModel(appDB)
}

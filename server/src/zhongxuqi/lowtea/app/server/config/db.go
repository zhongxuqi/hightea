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

	appDB := sess.DB(mainHander.Config.DBConfig.DBName)

	// init db
	mainHander.AppConfModel = model.NewAppConfigModel(appDB)
	err = mainHander.AppConfModel.Init(APPNAME, VERSION)
	if err != nil {
		panic(err)
	}

	var appConf model.AppConfig
	appConf, err = mainHander.AppConfModel.Find(APPNAME)
	if err != nil {
		panic(err)
	}

	if appConf.FlagExpiredTime <= 0 {
		mainHander.Config.FlagExpiredTime = FLAG_EXPIRED_TIME
		err = mainHander.AppConfModel.Update(APPNAME, bson.M{"flagExpiredTime": FLAG_EXPIRED_TIME})
		if err != nil {
			panic(err)
		}
	} else {
		mainHander.Config.FlagExpiredTime = appConf.FlagExpiredTime
	}

	mainHander.StarColl = appDB.C(mainHander.Config.DBConfig.StarColl)
	mainHander.StarColl.EnsureIndexKey("account", "documentId")

	mainHander.FlagColl = appDB.C(mainHander.Config.DBConfig.FlagColl)
	mainHander.FlagColl.EnsureIndexKey("createTime", "account", "documentId")

	// init session collection
	mainHander.SessModel = model.NewSessionModel(appDB)

	// init model
	mainHander.UserModel = model.NewUserModel(appDB, mainHander.Config.RootLanguage)
	mainHander.DocumentModel = model.NewDocumentModel(appDB)
	mainHander.RegisterModel = model.NewRegisterModel(appDB)
	mainHander.StarModal = model.NewStarModel(appDB)
}

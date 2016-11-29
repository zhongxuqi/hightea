package config

import (
	"labix.org/v2/mgo"

	"zhongxuqi/lowtea/app/server/handler"
)

// InitDB init the db env
func InitDB(mainHander *handler.MainHandler) {
	sess, err := mgo.Dial(mainHander.Config.DBConfig.Host)
	if err != nil {
		panic(err)
	}

	mainHander.UserColl = sess.DB(DBNAME).C(mainHander.Config.DBConfig.UserColl)
	mainHander.ReqisterColl = sess.DB(DBNAME).C(mainHander.Config.DBConfig.ReqisterColl)
}

package config

import (
	"labix.org/v2/mgo"

	"zhongxuqi/lowtea/app/server/servermodel"
)

// InitDB init the db env
func InitDB(mainServer *servermodel.MainServer) {
	sess, err := mgo.Dial(mainServer.Config.DBConfig.Host)
	if err != nil {
		panic(err)
	}

	mainServer.UserColl = sess.DB(DBNAME).C(mainServer.Config.DBConfig.UserColl)
}

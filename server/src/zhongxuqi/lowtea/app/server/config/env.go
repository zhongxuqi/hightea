package config

import (
	"encoding/json"
	"flag"
	"io/ioutil"

	"path/filepath"
	"zhongxuqi/lowtea/app/server/handler"
)

// InitEnv init the env varibles
func InitEnv(mainHandler *handler.MainHandler) {
	var configfile string

	flag.StringVar(&configfile, "f", "../configs/default.conf", "the config file of server")
	flag.Parse()

	b, err := ioutil.ReadFile(configfile)
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(b, &(mainHandler.Config))
	if err != nil {
		panic(err)
	}

	// check dbname
	if mainHandler.Config.DBConfig.DBName == "" {
		mainHandler.Config.DBConfig.DBName = APPNAME
	}

	mainHandler.Config.OssConfig.MediaPath, err = filepath.Abs(mainHandler.Config.OssConfig.MediaPath)
	if err != nil {
		panic(err)
	}
}

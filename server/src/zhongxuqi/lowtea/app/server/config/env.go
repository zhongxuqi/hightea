package config

import (
	"encoding/json"
	"flag"
	"io/ioutil"

	"zhongxuqi/lowtea/app/server/servermodel"
)

// InitEnv init the env varibles
func InitEnv(mainServer *servermodel.MainServer) {
	var configfile string

	flag.StringVar(&configfile, "f", "../configs/default.conf", "the config file of server")
	flag.Parse()

	b, err := ioutil.ReadFile(configfile)
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(b, &(mainServer.Config))
	if err != nil {
		panic(err)
	}
}

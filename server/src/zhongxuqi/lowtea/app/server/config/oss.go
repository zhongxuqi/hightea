package config

import (
	"zhongxuqi/lowtea/app/server/handler"
	"zhongxuqi/lowtea/oss"
)

func InitOss(mainHandler *handler.MainHandler) {
	mainHandler.Oss = oss.NewOss(mainHandler.Mux, &mainHandler.Config.OssConfig)
}

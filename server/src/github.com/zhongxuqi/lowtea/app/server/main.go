package main

import (
	"github.com/kataras/iris"
	"github.com/zhongxuqi/lowtea/app/server/config"
)

func main() {
	app := iris.New()

	config.AppRouter(app)

	app.Listen("0.0.0.0:8080")
}

package config

import (
	"github.com/kataras/iris"
)

// AppRouter ...
func AppRouter(app *iris.Framework) {

	// test api
	apiParty := app.Party("/api")
	apiParty.Get("/jsontest", func(c *iris.Context) {
		c.Text(200, `{"status":200, "message": "success"}`)
	})
}

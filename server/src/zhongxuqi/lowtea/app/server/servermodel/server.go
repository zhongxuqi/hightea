package servermodel

import (
	"net/http"

	"labix.org/v2/mgo"

	"zhongxuqi/lowtea/model"
)

// MainServer ...
type MainServer struct {
	Mux      *http.ServeMux
	Config   model.Config
	UserColl *mgo.Collection
}

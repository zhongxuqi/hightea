package utils

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
)

// ReadReq2Struct read the body of request and convert to struct
func ReadReq2Struct(req *http.Request, v interface{}) (err error) {
	data, err := ioutil.ReadAll(req.Body)
	if err != nil {
		return
	}
	err = json.Unmarshal(data, v)
	return
}

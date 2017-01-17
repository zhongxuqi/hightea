package utils

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
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

func GetRemoteIp(r *http.Request) (clientIp string) {
	clientIp = r.Header.Get("X-Forwarded-For")
	if strings.Index(clientIp, ",") >= 0 {
		clientIp = clientIp[0:strings.Index(clientIp, ",")]
	}
	if len(clientIp) == 0 {
		clientIp = FormatIp(r.RemoteAddr)
	}
	return
}

func FormatIp(ip string) (ipOut string) {
	if index := strings.Index(ip, ":"); index >= 0 {
		ipOut = ip[0:index]
	} else {
		ipOut = ip
	}
	return
}

package model

// RespBase base struct for http response
type RespBase struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

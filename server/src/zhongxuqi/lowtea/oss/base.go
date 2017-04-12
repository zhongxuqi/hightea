package oss

import (
	"mime/multipart"
	"net/http"
	"regexp"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/oss/local"
)

type OssIBase interface {
	InitOss(handler *http.ServeMux, cfg *model.OSSConfig)
	SaveImage(file *multipart.File) (url string, err error)
	SaveAudio(file *multipart.File) (url string, err error)
	SaveVideo(file *multipart.File) (url string, err error)
	GetAllMedia() (ret map[string]int, err error)
	GetRegExpPattern() (re *regexp.Regexp)
	DeleteMediaFile(file string) (err error)
}

func NewOss(handler *http.ServeMux, cfg *model.OSSConfig) (ret OssIBase) {
	if cfg.OssProvider == model.LOCAL {
		ret = local.NewOss(handler, cfg)
	}
	return
}

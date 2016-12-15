package oss

import (
	"mime/multipart"
	"net/http"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/oss/local"
)

type OssIBase interface {
	InitOss(handler *http.ServeMux, cfg *model.OSSConfig)
	SaveImage(file *multipart.File) (url string, err error)
	SaveVideo(file *multipart.File) (url string, err error)
}

func NewOss(handler *http.ServeMux, cfg *model.OSSConfig) (ret OssIBase) {
	if cfg.OssProvider == model.LOCAL {
		ret = local.NewOss(handler, cfg)
	}
	return
}

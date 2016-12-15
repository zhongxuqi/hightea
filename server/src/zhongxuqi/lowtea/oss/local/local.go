package local

import (
	"errors"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"zhongxuqi/lowtea/model"

	"gopkg.in/mgo.v2/bson"
)

const (
	imagePath = "../media/lowtea_img"
	videoPath = "../media/lowtea_video"
)

type LocalOss struct {
}

func NewOss(handler *http.ServeMux, cfg *model.OSSConfig) (ret *LocalOss) {
	ret = &LocalOss{}
	ret.InitOss(handler, cfg)
	return
}

func (p *LocalOss) InitOss(handler *http.ServeMux, cfg *model.OSSConfig) {

	// init media dir
	var dirInfo os.FileInfo
	var err error

	dirInfo, err = os.Stat(imagePath)
	if err != nil {
		if os.IsNotExist(err) {
			os.MkdirAll(imagePath, 0750)
		} else {
			panic(err)
		}
	} else {
		if !dirInfo.IsDir() {
			panic(errors.New(imagePath + " is not a directionary"))
		}
	}

	// init video dir
	dirInfo, err = os.Stat(videoPath)
	if err != nil {
		if os.IsNotExist(err) {
			os.MkdirAll(videoPath, 0750)
		} else {
			panic(err)
		}
	} else {
		if !dirInfo.IsDir() {
			panic(errors.New(videoPath + "is not a directionary"))
		}
	}

	// init img handler
	handler.Handle("/lowtea_img/", http.FileServer(http.Dir("../media")))

}

func (p *LocalOss) SaveImage(imageBody *multipart.File) (url string, err error) {
	filename := bson.NewObjectId().Hex()
	imagefile, err := os.Create("../media/lowtea_img/" + filename)
	if err != nil {
		return
	}
	imageByte, err := ioutil.ReadAll(*imageBody)
	if err != nil {
		return
	}
	_, err = imagefile.Write(imageByte)
	if err != nil {
		return
	}

	url = "/lowtea_img/" + filename
	return
}

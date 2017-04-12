package local

import (
	"errors"
	"fmt"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"time"
	"zhongxuqi/lowtea/model"
	"zhongxuqi/lowtea/utils"

	"regexp"

	"gopkg.in/mgo.v2/bson"
)

const (
	imagePathName = "/lowtea_img"
	audioPathName = "/lowtea_audio"
	videoPathName = "/lowtea_video"
)

type LocalOss struct {
	RootPath  string
	ImagePath string
	AudioPath string
	VideoPath string
}

func NewOss(handler *http.ServeMux, cfg *model.OSSConfig) (ret *LocalOss) {
	ret = &LocalOss{
		RootPath:  cfg.MediaPath,
		ImagePath: cfg.MediaPath + imagePathName,
		AudioPath: cfg.MediaPath + audioPathName,
		VideoPath: cfg.MediaPath + videoPathName,
	}
	ret.InitOss(handler, cfg)
	return
}

func (p *LocalOss) InitOss(handler *http.ServeMux, cfg *model.OSSConfig) {

	// init media dir
	var dirInfo os.FileInfo
	var err error

	// init img dir
	dirInfo, err = os.Stat(p.ImagePath)
	if err != nil {
		if os.IsNotExist(err) {
			os.MkdirAll(p.ImagePath, 0750)
		} else {
			panic(err)
		}
	} else {
		if !dirInfo.IsDir() {
			panic(errors.New(p.ImagePath + " is not a directionary"))
		}
	}

	// init audio dir
	dirInfo, err = os.Stat(p.AudioPath)
	if err != nil {
		if os.IsNotExist(err) {
			os.MkdirAll(p.AudioPath, 0750)
		} else {
			panic(err)
		}
	} else {
		if !dirInfo.IsDir() {
			panic(errors.New(p.AudioPath + " is not a directionary"))
		}
	}

	// init video dir
	dirInfo, err = os.Stat(p.VideoPath)
	if err != nil {
		if os.IsNotExist(err) {
			os.MkdirAll(p.VideoPath, 0750)
		} else {
			panic(err)
		}
	} else {
		if !dirInfo.IsDir() {
			panic(errors.New(p.VideoPath + "is not a directionary"))
		}
	}

	// init img handler
	imgFileHandler := http.FileServer(http.Dir(p.RootPath))
	handler.HandleFunc("/lowtea_img/", func(w http.ResponseWriter, r *http.Request) {
		imgFileHandler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s %s\n", time.Now().String(), utils.GetRemoteIp(r), r.Method, r.URL.Path)
	})

	// init audio handler
	audioFileHandler := http.FileServer(http.Dir(p.RootPath))
	handler.HandleFunc("/lowtea_audio/", func(w http.ResponseWriter, r *http.Request) {
		audioFileHandler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s %s\n", time.Now().String(), utils.GetRemoteIp(r), r.Method, r.URL.Path)
	})

	// init video handler
	videoFileHandler := http.FileServer(http.Dir(p.RootPath))
	handler.HandleFunc("/lowtea_video/", func(w http.ResponseWriter, r *http.Request) {
		videoFileHandler.ServeHTTP(w, r)
		fmt.Printf("%s %s %s %s\n", time.Now().String(), utils.GetRemoteIp(r), r.Method, r.URL.Path)
	})
}

func (p *LocalOss) SaveImage(imageBody *multipart.File) (url string, err error) {
	filename := bson.NewObjectId().Hex()
	var imagefile *os.File
	imagefile, err = os.Create(p.ImagePath + "/" + filename)
	if err != nil {
		return
	}
	var imageByte []byte
	imageByte, err = ioutil.ReadAll(*imageBody)
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

func (p *LocalOss) SaveAudio(audioBody *multipart.File) (url string, err error) {
	filename := bson.NewObjectId().Hex()
	var audiofile *os.File
	audiofile, err = os.Create(p.AudioPath + "/" + filename)
	if err != nil {
		return
	}
	var audioByte []byte
	audioByte, err = ioutil.ReadAll(*audioBody)
	if err != nil {
		return
	}
	_, err = audiofile.Write(audioByte)
	if err != nil {
		return
	}

	url = "/lowtea_audio/" + filename
	return
}

func (p *LocalOss) SaveVideo(videoBody *multipart.File) (url string, err error) {
	filename := bson.NewObjectId().Hex()
	var videofile *os.File
	videofile, err = os.Create(p.VideoPath + "/" + filename)
	if err != nil {
		return
	}
	var videoByte []byte
	videoByte, err = ioutil.ReadAll(*videoBody)
	if err != nil {
		return
	}
	_, err = videofile.Write(videoByte)
	if err != nil {
		return
	}

	url = "/lowtea_video/" + filename
	return
}

func (p *LocalOss) GetAllMedia() (ret map[string]int, err error) {
	ret = make(map[string]int)

	// read image
	var imagefiles []os.FileInfo
	imagefiles, err = ioutil.ReadDir(p.ImagePath)
	if err != nil {
		return
	}
	for _, file := range imagefiles {
		ret[imagePathName+"/"+file.Name()] = 1
	}

	// read audio
	var audiofiles []os.FileInfo
	audiofiles, err = ioutil.ReadDir(p.AudioPath)
	if err != nil {
		return
	}
	for _, file := range audiofiles {
		ret[audioPathName+"/"+file.Name()] = 1
	}

	// read vedio
	var videofiles []os.FileInfo
	videofiles, err = ioutil.ReadDir(p.VideoPath)
	if err != nil {
		return
	}
	for _, file := range videofiles {
		ret[videoPathName+"/"+file.Name()] = 1
	}
	return
}

func (p *LocalOss) GetRegExpPattern() (ret *regexp.Regexp) {
	ret = regexp.MustCompile("(" + imagePathName + "|" + audioPathName + "|" + videoPathName + ")/[0-9a-z]+")
	return
}

func (p *LocalOss) DeleteMediaFile(file string) (err error) {
	err = os.Remove(p.RootPath + file)
	return
}

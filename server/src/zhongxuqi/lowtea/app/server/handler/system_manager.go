package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"sort"
	"strings"
	"zhongxuqi/lowtea/model"
)

const (
	dumpFileName = "./dump-all.sh"
	dumpPath     = "../dumps"
	dumpSuffix   = ".tar.gz"
)

func (p *MainHandler) DumpSystem(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		go func() {
			cmd := exec.Command("bash", "-c", strings.Join([]string{"cd .. &&", dumpFileName, p.Config.DBConfig.Host, p.Config.DBConfig.DBName, p.Config.OssConfig.MediaPath}, " "))
			var out bytes.Buffer
			cmd.Stdout = &out
			err := cmd.Run()
			if err != nil {
				fmt.Println("dump error: " + err.Error())
				return
			}
			fmt.Println(string(out.Bytes()))
		}()
		b, _ := json.Marshal(&model.RespBase{
			Status: 200,
		})
		w.Write(b)
		return
	}
	http.Error(w, "Not Found", 404)
}

type filename []string

func (a filename) Len() int           { return len(a) }
func (a filename) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a filename) Less(i, j int) bool { return a[i] > a[j] }

func (p *MainHandler) DumpFiles(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		fileInfo, err := ioutil.ReadDir(dumpPath)
		if err != nil {
			http.Error(w, "read dumps dir error: "+err.Error(), 500)
			return
		}

		var ret struct {
			Status  int      `json:"status"`
			Message string   `json:"message"`
			Files   []string `json:"files"`
		}
		ret.Files = make([]string, 0, len(fileInfo))
		for _, file := range fileInfo {
			if strings.Contains(file.Name(), dumpSuffix) {
				ret.Files = append(ret.Files, file.Name())
			}
		}
		sort.Sort(filename(ret.Files))
		ret.Status = 200
		b, _ := json.Marshal(ret)
		w.Write(b)
		return
	}
	http.Error(w, "Not Found", 404)
}

func (p *MainHandler) DownloadDumpFile(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		cmds := strings.Split(r.URL.Path, "/")
		if len(cmds) > 5 {
			http.Error(w, "Not Found", 404)
			return
		}
		dumpFileName := cmds[len(cmds)-1]
		var err error
		if _, err = os.Stat(dumpPath + "/" + dumpFileName); os.IsNotExist(err) {
			http.Error(w, "file is not exist", 400)
			return
		}
		var file *os.File
		file, err = os.Open(dumpPath + "/" + dumpFileName)
		var data []byte
		data, err = ioutil.ReadAll(file)
		if err != nil {
			http.Error(w, "dumpfile read error: "+err.Error(), 500)
			return
		}
		w.Header().Add("Content-Type", "application/octet-stream")
		w.Header().Add("Content-Disposition", "attachment; filename=\""+dumpFileName+"\"")
		w.Write(data)
		return
	}
	http.Error(w, "Not Found", 404)
}

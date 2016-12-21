package model

const (
	LOCAL = "local"
	QINIU = "qiniu"
)

type AppConfig struct {
	App             string `json:"app"`
	Version         string `json:"version"`
	FlagExpiredTime int64  `json:"flagExpiredTime"`
}

// Config env of the server
type Config struct {
	RootEmail       string    `json:"rootemail"`
	RootPassword    string    `json:"rootpassword"`
	RootLanguage    string    `json:"rootlanguage"`
	DBConfig        DBConfig  `json:"dbConfig"`
	OssConfig       OSSConfig `json:"ossConfig"`
	FlagExpiredTime int64     `json:"-"`
}

// DBConfig env of the db
type DBConfig struct {
	Host         string `json:"host"`
	User         string `json:"user"`
	Password     string `json:"password"`
	DBName       string `json:"dbname"`
	UserColl     string `json:"userColl"`
	RegisterColl string `json:"reqisterColl"`
	DocumentColl string `json:"documentColl"`
	StarColl     string `json:"starColl"`
	FlagColl     string `json:"flagColl"`
}

type OSSConfig struct {
	OssProvider string `json:"ossProvider"`
}

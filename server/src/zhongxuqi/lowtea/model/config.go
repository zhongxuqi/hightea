package model

// Config env of the server
type Config struct {
	RootPassword string   `json:"rootpassword"`
	DBConfig     DBConfig `json:"dbConfig"`
}

// DBConfig env of the db
type DBConfig struct {
	Host         string `json:"host"`
	DBName       string `json:"dbname"`
	UserColl     string `json:"userColl"`
	ReqisterColl string `json:"reqisterColl"`
}

package model

// Config env of the server
type Config struct {
	RootEmail    string   `json:"rootemail"`
	RootPassword string   `json:"rootpassword"`
	RootLanguage string   `json:"rootlanguage"`
	DBConfig     DBConfig `json:"dbConfig"`
}

// DBConfig env of the db
type DBConfig struct {
	Host         string `json:"host"`
	DBName       string `json:"dbname"`
	UserColl     string `json:"userColl"`
	RegisterColl string `json:"reqisterColl"`
}

package model

// User the user info struct
type User struct {
	BaseObj
	UserName string `json:"username" bson:"username"`
	Password string `json:"password" bson:"password"`
	Grade    string `json:"grade" bson:"grade"`
}

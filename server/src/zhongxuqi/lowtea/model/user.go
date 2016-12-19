package model

import "gopkg.in/mgo.v2/bson"

const (
	// ROOT the user flag for User.Role
	ROOT = "root"
	// ADMIN the user flag for User.Role
	ADMIN = "admin"
	// MEMBER the user flag for User.Role
	MEMBER = "member"
	// GUEST the user flag for User.Role
	GUEST = "guest"

	// MALE the gender flag for User.Gender
	MALE = "male"
	// FEMAIL the gender flag for User.Gender
	FEMAIL = "female"
)

// User the struct of user
type User struct {
	ID        bson.ObjectId `json:"id" bson:"_id"`
	Account   string        `json:"account" bson:"account"`
	Email     string        `json:"email" bson:"email"`
	NickName  string        `json:"nickname" bson:"nickname"`
	HeadImg   string        `json:"headImg" bson:"headImg"`
	PassWord  string        `json:"-" bson:"password"`
	UserIntro string        `json:"userintro" bson:"userintro"`
	Gender    string        `json:"gender" bson:"gender"`
	Role      string        `json:"role" bson:"role"`
	Language  string        `json:"language" bson:"language"`
}

// Register the struct of register
type Register struct {
	ID       bson.ObjectId `json:"id" bson:"_id"`
	Account  string        `json:"account" bson:"account"`
	Email    string        `json:"email" bson:"email"`
	NickName string        `json:"nickname" bson:"nickname"`
	Resume   string        `json:"resume" bson:"resume"`
	PassWord string        `json:"password" bson:"password"`
}

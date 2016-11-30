package model

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
	MgoBase
	Account   string `json:"account" bson:"account"`
	NickName  string `json:"nickname" bson:"nickname"`
	PassWord  string `json:"-" bson:"password"`
	UserIntro string `json:"userintro" bson:"userintro"`
	Gender    string `json:"gender" bson:"gender"`
	Role      string `json:"role" bson:"role"`
}

// Register the struct of register
type Register struct {
	MgoBase
	Account  string `json:"account" bson:"account"`
	Resume   string `json:"resume" bson:"resume"`
	PassWord string `json:"password" bson:"password"`
}

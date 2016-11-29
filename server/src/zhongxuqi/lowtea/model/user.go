package model

const (
	// ADMIN the admin flag for User.Role
	ADMIN = "admin"
	// MEMBER the admin flag for User.Role
	MEMBER = "member"
	// GUEST the admin flag for User.Role
	GUEST = "guest"

	// MALE the gender flag for User.Gender
	MALE = "male"
	// FEMAIL the gender flag for User.Gender
	FEMAIL = "female"
)

// User the struct of user
type User struct {
	BaseMgo
	UserName  string `json:"username" bson:"username"`
	PassWord  string `json:"password" bson:"password"`
	UserIntro string `json:"userintro" bson:"userintro"`
	Gender    string `json:"gender" bson:"gender"`
	Role      string `json:"role" bson:"role"`
}

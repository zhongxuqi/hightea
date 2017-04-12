package model

import (
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

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
	ID        bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Account   string        `json:"account" bson:"account"`
	Email     string        `json:"email" bson:"email"`
	NickName  string        `json:"nickname" bson:"nickname"`
	HeadImg   string        `json:"headimg" bson:"headimg"`
	PassWord  string        `json:"-" bson:"password"`
	UserIntro string        `json:"userintro" bson:"userintro"`
	Gender    string        `json:"gender" bson:"gender"`
	Role      string        `json:"role" bson:"role"`
	Language  string        `json:"language" bson:"language"`
}

type UserModel struct {
	coll         *mgo.Collection
	RootLanguage string
}

func NewUserModel(db *mgo.Database, rootLanguage string) (userModel *UserModel) {
	return &UserModel{
		coll:         db.C("users"),
		RootLanguage: rootLanguage,
	}
}

func (p *UserModel) GetAll() (ret []User, err error) {
	ret = make([]User, 0)
	err = p.coll.Find(nil).All(&ret)
	return
}

func (p *UserModel) Insert(user User) (err error) {
	err = p.coll.Insert(user)
	return
}

func (p *UserModel) FindByAccount(account string) (user User, err error) {
	if account == ROOT {
		user = User{
			Account:  ROOT,
			NickName: ROOT,
			Role:     ROOT,
			Language: p.RootLanguage,
		}
	} else {
		err = p.coll.Find(bson.M{"account": account}).One(&user)
	}
	return
}

func (p *UserModel) Count() (n int, err error) {
	n, err = p.coll.Count()
	return
}

func (p *UserModel) CountByAccount(account string) (n int, err error) {
	n, err = p.coll.Find(bson.M{"account": account}).Count()
	return
}

func (p *UserModel) CountByRole(role string) (n int, err error) {
	n, err = p.coll.Find(bson.M{"role": role}).Count()
	return
}

func (p *UserModel) UpdateAccount(account string, data interface{}) (err error) {
	err = p.coll.Update(bson.M{"account": account}, bson.M{"$set": data})
	return
}

func (p *UserModel) UpdatePassword(account, password, newPassWord string) (err error) {
	err = p.coll.Update(bson.M{"account": account, "password": password}, bson.M{
		"$set": bson.M{
			"password": newPassWord,
		},
	})
	return
}

func (p *UserModel) ResetPassword(account, newPassWord string) (err error) {
	err = p.coll.Update(bson.M{"account": account}, bson.M{
		"$set": bson.M{
			"password": newPassWord,
		},
	})
	return
}

func (p *UserModel) RemoveByAccount(account string) (err error) {
	err = p.coll.Remove(bson.M{"account": account})
	return
}

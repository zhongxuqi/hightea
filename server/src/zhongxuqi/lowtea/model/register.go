package model

import "gopkg.in/mgo.v2/bson"
import "gopkg.in/mgo.v2"

// Register the struct of register
type Register struct {
	ID       bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Account  string        `json:"account" bson:"account"`
	Email    string        `json:"email" bson:"email"`
	NickName string        `json:"nickname" bson:"nickname"`
	Resume   string        `json:"resume" bson:"resume"`
	PassWord string        `json:"password,omitempty" bson:"password,omitempty"`
}

type RegisterModel struct {
	coll *mgo.Collection
}

func NewRegisterModel(db *mgo.Database) (registerModel *RegisterModel) {
	return &RegisterModel{
		coll: db.C("registers"),
	}
}

func (p *RegisterModel) GetAll() (registers []Register, err error) {
	registers = make([]Register, 0)
	err = p.coll.Find(nil).All(&registers)

	// delete password
	for i := range registers {
		registers[i].PassWord = ""
	}
	return
}

func (p *RegisterModel) FindByAccount(account string) (register Register, err error) {
	err = p.coll.Find(bson.M{"account": account}).One(&register)
	return
}

func (p *RegisterModel) RemoveByAccount(account string) (err error) {
	err = p.coll.Remove(bson.M{"account": account})
	return
}

func (p *RegisterModel) CountByAccount(account string) (n int, err error) {
	n, err = p.coll.Find(bson.M{"account": account}).Count()
	return
}

func (p *RegisterModel) Insert(register Register) (err error) {
	err = p.coll.Insert(register)
	return
}

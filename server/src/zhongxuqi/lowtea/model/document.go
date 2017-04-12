package model

import "gopkg.in/mgo.v2/bson"
import "gopkg.in/mgo.v2"

const (
	STATUS_DRAFT          = "status_draft"
	STATUS_PUBLISH_SELF   = "status_publish_self"
	STATUS_PUBLISH_MEMBER = "status_publish_member"
	STATUS_PUBLISH_PUBLIC = "status_publish_public"
)

type Document struct {
	Id         bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Title      string        `json:"title" bson:"title"`
	Content    string        `json:"content" bson:"content"`
	CreateTime int64         `json:"createTime" bson:"createTime"`
	ModifyTime int64         `json:"modifyTime" bson:"modifyTime"`
	Account    string        `json:"account" bson:"account"`
	Status     string        `json:"status" bson:"status"`
	StarNum    int           `json:"starNum" bson:"-"`
	FlagNum    int           `json:"flagNum" bson:"-"`
}

type DocumentModel struct {
	coll *mgo.Collection
}

func NewDocumentModel(db *mgo.Database) (documentModel *DocumentModel) {
	coll := db.C("documents")
	coll.EnsureIndexKey("createTime")
	return &DocumentModel{
		coll: coll,
	}
}

func (p *DocumentModel) GetAll() (ret []Document, err error) {
	ret = make([]Document, 0)
	err = p.coll.Find(nil).All(&ret)
	return
}

func (p *DocumentModel) CountByFilter(filter bson.M) (n int, err error) {
	n, err = p.coll.Find(filter).Count()
	return
}

func (p *DocumentModel) SortFindByFilterWithPage(filter bson.M, sorter string, skip, limit int) (documents []Document, err error) {
	documents = make([]Document, 0)
	err = p.coll.Find(&filter).Sort(sorter).Skip(skip).Limit(limit).All(&documents)
	return
}

func (p *DocumentModel) SortFindByFilterAndSelecterWithPage(filter, selector bson.M, sorter string, skip, limit int) (documents []Document, err error) {
	documents = make([]Document, 0)
	err = p.coll.Find(&filter).Select(selector).Sort(sorter).Skip(skip).Limit(limit).All(&documents)
	return
}

func (p *DocumentModel) Insert(document Document) (err error) {
	err = p.coll.Insert(document)
	return
}

func (p *DocumentModel) FindByTimeAccountTitleContent(time int64, account, title, content string) (document Document, err error) {
	err = p.coll.Find(bson.M{
		"modifyTime": time,
		"account":    account,
		"title":      title,
		"content":    content,
	}).All(&document)
	return
}

func (p *DocumentModel) FindDocument(id bson.ObjectId) (document Document, err error) {
	err = p.coll.Find(bson.M{"_id": id}).One(&document)
	return
}

func (p *DocumentModel) FindByFilter(filter bson.M) (document Document, err error) {
	err = p.coll.Find(filter).One(&document)
	return
}

func (p *DocumentModel) FindDocumentWithSelector(id bson.ObjectId, selector bson.M) (document Document, err error) {
	err = p.coll.Find(bson.M{"_id": id}).Select(selector).One(&document)
	return
}

func (p *DocumentModel) FindByFilterWithSelector(filter bson.M, selector bson.M) (document Document, err error) {
	err = p.coll.Find(filter).Select(selector).One(&document)
	return
}

func (p *DocumentModel) UpdateDocument(id bson.ObjectId, data interface{}) (err error) {
	err = p.coll.Update(bson.M{"_id": id}, bson.M{"$set": data})
	return
}

func (p *DocumentModel) Remove(id bson.ObjectId) (err error) {
	err = p.coll.Remove(&bson.M{"_id": id})
	return
}

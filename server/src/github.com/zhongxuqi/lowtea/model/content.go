package model

// Content ...
type Content struct {
	BaseObj
	CreatorID          string `json:"creatorId" bson:"creatorId"`
	CreatedTime        int64  `json:"createdTime" bson:"createdTime"`
	RawContent         string `json:"rawContent" bson:"rawContent"`
	HTMLContent        string `json:"htmlContent" bson:"htmlContent"`
	LastModifiedUserID string `json:"lastModifiedUserId" bson:"lastModifiedUserId"`
	LastModifiedTime   int64  `json:"lastModifiedTime" bson:"lastModifiedTime"`
}

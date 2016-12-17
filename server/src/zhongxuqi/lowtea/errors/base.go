package errors

import "errors"

var (
	ERROR_MISS_ACCOUNT = errors.New("miss account")

	ERROR_USERNAME_EXISTS   = errors.New("username exists")
	ERROR_PERMISSION_DENIED = errors.New("permission denied")

	ERROR_OBJECTID_INVALID = errors.New("objectID is invalid")
	ERROR_ACTION_INVALID   = errors.New("action is invalid")

	ERROR_SET_ROOTPASSWORD = errors.New("error to set root password")

	ERROR_INVAIL_METHOD = errors.New("method is invalid")

	ERROR_EMPTY_ID  = errors.New("id is empty")
	ERROR_INVAIL_ID = errors.New("id is invail")

	ERROR_EMPTY_TITLE = errors.New("title is empty")
)

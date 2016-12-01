package errors

import "errors"

var (
	ERROR_OBJECTID_INVALID = errors.New("objectID is invalid")
	ERROR_ACTION_INVALID   = errors.New("action is invalid")
)

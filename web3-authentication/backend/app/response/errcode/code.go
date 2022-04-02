package errcode

import "sync"

// Error Codes
const (
	ValidationError     = "VALIDATION_ERROR"
	NotFoundError       = "NOT_FOUND"
	InvalidRequest      = "INVALID_REQUEST"
	SystemError         = "SYSTEM_ERROR"
	Unauthorized        = "UNAUTHORIZED"
	InvalidAccessToken  = "INVALID_ACCESS_TOKEN"
	APIEndpointNotExist = "API_ENDPOINT_NOT_EXIST"
)

// Message :
var Message sync.Map

func init() {
	Message.Store(ValidationError, "Validation error")
	Message.Store(InvalidRequest, "Request input is invalid")
	Message.Store(SystemError, "System busy, please try again")
	Message.Store(NotFoundError, "No results found")
	Message.Store(InvalidAccessToken, "Token is invalid")
	Message.Store(Unauthorized, "Unauthorized request")
	Message.Store(APIEndpointNotExist, "API endpoint not exist")
}

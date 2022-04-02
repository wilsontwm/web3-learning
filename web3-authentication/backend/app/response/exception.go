package response

import (
	"bytes"
	"fmt"

	"github.com/labstack/echo/v4"

	"backend/app/response/errcode"
)

// Exception :
type Exception struct {
	context echo.Context
	Code    string
	Detail  string
	Error   error
}

// NewException :
func NewException(c echo.Context, code string, err error) Exception {
	return Exception{
		context: c,
		Code:    code,
		Error:   err,
	}
}

// MarshalJSON :
func (e Exception) MarshalJSON() ([]byte, error) {
	bb := new(bytes.Buffer)
	bb.WriteString(`{`)
	bb.WriteString(`"error":{`)
	bb.WriteString(`"code":`)
	bb.WriteString(fmt.Sprintf("%q", fmt.Sprintf("%s", e.Code)))
	message, isExist := errcode.Message.Load(e.Code)
	if isExist {
		bb.WriteString(",")
		bb.WriteString(`"message":`)
		bb.WriteString(fmt.Sprintf("%q", message))
	} else {
		bb.WriteString(",")
		bb.WriteString(`"message":`)
		bb.WriteString(fmt.Sprintf("%q", e.Error.Error()))
	}

	if e.Detail != "" {
		bb.WriteString(",")
		bb.WriteString(`"detail":`)
		bb.WriteString(fmt.Sprintf("%q", e.Detail))
	}

	if e.Error != nil {
		bb.WriteString(",")
		bb.WriteString(`"debug":`)
		bb.WriteString(fmt.Sprintf("%q", e.Error.Error()))
	}

	bb.WriteString(`}`)
	bb.WriteString(`}`)

	return bb.Bytes(), nil
}

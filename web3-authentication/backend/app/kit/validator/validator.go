package validator

import (
	"reflect"
	"strings"

	validator "gopkg.in/go-playground/validator.v9"
)

// New :
func New() *CustomValidator {
	validator := validator.New()
	validator.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
	return &CustomValidator{validator: validator}
}

// CustomValidator :
type CustomValidator struct {
	validator *validator.Validate
}

// Validate :
func (cv *CustomValidator) Validate(i interface{}) error {
	return cv.validator.Struct(i)
}

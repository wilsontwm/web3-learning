package httprequest

import (
	"errors"
	"reflect"

	api "github.com/myussufz/fasthttp-api"
)

// HttpAPI :
func HttpAPI(method, requestURL string, headers map[string]string, request, response interface{}) error {
	if reflect.ValueOf(response).Kind() != reflect.Ptr {
		return errors.New("response struct should be pointer")
	}

	return api.Fetch(requestURL, api.Option{
		Method:  method,
		Headers: headers,
		Body:    request,
	}).ToJSON(response)
}

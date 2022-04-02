package router

import (
	"backend/app/bootstrap"
	"backend/app/handler"
	midware "backend/app/middleware"

	"github.com/labstack/echo/v4"
)

// Router :
type Router struct {
	apiMiddleware *midware.Middleware
	handler       *handler.Handler
}

// New :
func New(e *echo.Echo, bs *bootstrap.Bootstrap) {
	router := Router{
		apiMiddleware: midware.New(bs),
		handler:       handler.New(bs),
	}

	e.GET("/health", router.handler.APIHealthCheck)
	userV1(e, &router)
}

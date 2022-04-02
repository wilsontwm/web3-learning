package router

import (
	"github.com/labstack/echo/v4"
)

// userV1 :
func userV1(e *echo.Echo, r *Router) {
	h := r.handler
	mw := r.apiMiddleware
	v1 := e.Group("/v1")

	v1.POST("/generate-nonce", h.AuthGenerateNonce)
	v1.POST("/verify-signature", h.AuthVerifySignature)

	authRoute := v1.Group("", mw.UserAuthorization())
	_ = authRoute
}

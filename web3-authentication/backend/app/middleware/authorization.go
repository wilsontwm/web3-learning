package middleware

import (
	"errors"
	"net/http"
	"strings"

	"backend/app/env"
	"backend/app/model"
	"backend/app/response"
	"backend/app/response/errcode"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)

// UserAuthorization :
func (mw *Middleware) UserAuthorization() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			authorizationToken := c.Request().Header.Get("Authorization")
			token := strings.Split(authorizationToken, " ")
			if len(token) != 2 {
				return c.JSON(http.StatusUnauthorized, response.NewException(c, errcode.Unauthorized, errors.New("invalid authorization header")))
			}

			parsedToken, err := jwt.ParseWithClaims(token[1], &model.UserToken{}, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, errors.New("invalid JWT signing method")
				}
				return []byte(env.Config.App.JWTSecretKey), nil
			})
			if err != nil {
				return c.JSON(http.StatusUnauthorized, response.NewException(c, errcode.InvalidAccessToken, errors.New("invalid authorization header")))
			}

			if claims, ok := parsedToken.Claims.(*model.UserToken); ok && parsedToken.Valid {
				if claims.Audience == "user" {
					c.Set(model.ContextUser, claims.User)
					return next(c)
				}
			}
			return c.JSON(http.StatusForbidden, response.NewException(c, errcode.InvalidAccessToken, errors.New("invalid access token")))
		}
	}
}

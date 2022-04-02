package app

import (
	"backend/app/bootstrap"
	"backend/app/constant"
	"backend/app/kit/validator"
	"backend/app/response"
	"backend/app/response/errcode"
	"backend/app/router"
	"fmt"

	"math/rand"
	"net/http"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

type host struct {
	Echo *echo.Echo
}

// Start :
func Start(port string) {

	bs := bootstrap.New()

	e := echo.New()
	e.Validator = validator.New()

	e.Use(
		middleware.Recover(),
		middleware.Logger(),
		middleware.RequestIDWithConfig(middleware.RequestIDConfig{
			Generator: func() string {
				return fmt.Sprintf("%d%d", time.Now().UnixNano(), rand.Intn(100000))
			},
		}))

	// CORS : Allow cross site domain
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     constant.CORSDomain,
		AllowMethods:     []string{echo.GET, echo.PUT, echo.POST, echo.DELETE, echo.PATCH, echo.OPTIONS, echo.HEAD},
		AllowCredentials: true,
		MaxAge:           24 * 60 * 60,
	}))

	router.New(e, bs)

	e.Logger.Fatal(e.Start(":" + port))
}

// customErrorHandler :
func customErrorHandler(err error, c echo.Context) {
	code := strings.TrimSpace(strings.Replace(err.Error(), "code=", "", -1))

	switch code[:3] {
	case "404", "405":
		c.JSON(http.StatusNotFound, response.Exception{Code: errcode.APIEndpointNotExist, Error: err})
		return

	default:
		c.JSON(http.StatusInternalServerError, response.Exception{Code: errcode.APIEndpointNotExist, Error: err})
		return
	}
}

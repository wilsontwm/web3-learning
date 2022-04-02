package handler

import (
	"fmt"
	"net/http"

	"backend/app/bootstrap"
	"backend/app/env"
	"backend/app/repository"

	"github.com/labstack/echo/v4"
)

// Handler :
type Handler struct {
	repository *repository.Repository
}

// New :
func New(bs *bootstrap.Bootstrap) *Handler {
	return &Handler{
		repository: bs.Repository,
	}
}

// APIHealthCheck :
func (h Handler) APIHealthCheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": fmt.Sprintf("Your server version %s is running", env.Config.App.Version),
	})
}

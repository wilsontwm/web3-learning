package middleware

import (
	"backend/app/bootstrap"
	"backend/app/repository"

	"go.mongodb.org/mongo-driver/mongo"
)

// Middleware :
type Middleware struct {
	mongodb    *mongo.Client
	repository *repository.Repository
}

// New :
func New(bs *bootstrap.Bootstrap) *Middleware {
	h := &Middleware{
		mongodb:    bs.MongoDB,
		repository: bs.Repository,
	}

	return h
}

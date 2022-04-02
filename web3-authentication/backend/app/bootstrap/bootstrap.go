package bootstrap

import (
	"backend/app/repository"
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

// Bootstrap :
type Bootstrap struct {
	MongoDB    *mongo.Client
	Repository *repository.Repository
}

// New :
func New() *Bootstrap {

	bs := new(Bootstrap)
	bs.initMongoDB()

	repo := repository.New(context.Background(), bs.MongoDB)

	bs.Repository = repo

	return bs
}

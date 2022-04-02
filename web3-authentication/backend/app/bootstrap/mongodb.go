package bootstrap

import (
	"context"
	"fmt"
	"time"

	"backend/app/env"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func (bs *Bootstrap) initMongoDB() *Bootstrap {
	ctx := context.Background()

	// connect db
	connStr := fmt.Sprintf(
		"mongodb://%s:%s@%s/%s",
		env.Config.Mongo.Username,
		env.Config.Mongo.Password,
		env.Config.Mongo.Host,
		env.Config.Mongo.DBName,
	)

	client, err := mongo.NewClient(options.Client().ApplyURI(connStr))
	if err != nil {
		panic(err)
	}

	ctx, cancel := context.WithTimeout(ctx, 20*time.Second)
	defer cancel()
	if err := client.Connect(ctx); err != nil {
		panic(err)
	}

	bs.MongoDB = client

	return bs
}

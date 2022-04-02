package repository

import (
	"backend/app/env"
	"backend/app/model"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Repository :
type Repository struct {
	db *mongo.Database
}

// New :
func New(ctx context.Context, mongo *mongo.Client) *Repository {
	return &Repository{
		db: mongo.Database(env.Config.Mongo.DBName),
	}
}

// GetDB :
func (r Repository) GetDB() *mongo.Database {
	return r.db
}

// Create : a generic function to create entity
func (r Repository) Create(entityName model.Collection, entity interface{}) (*mongo.InsertOneResult, error) {
	insertResult, err := r.db.Collection(entityName).InsertOne(context.Background(), entity)
	if err != nil {
		return nil, err
	}
	return insertResult, nil
}

// FindByID :
func (r Repository) FindByID(entityName model.Collection, id primitive.ObjectID, v interface{}) error {

	return r.db.Collection(entityName).FindOne(
		context.Background(),
		bson.M{"_id": id},
	).Decode(v)
}

// FindByHexID :
func (r Repository) FindByHexID(entityName model.Collection, hex string, v interface{}) error {
	id, err := primitive.ObjectIDFromHex(hex)
	if err != nil {
		return nil
	}

	return r.db.Collection(entityName).FindOne(
		context.Background(),
		bson.M{"_id": id},
	).Decode(v)
}

// Delete :
func (r Repository) Delete(entityName model.Collection, id primitive.ObjectID) error {

	_, err := r.db.Collection(entityName).DeleteOne(
		context.Background(),
		bson.M{"_id": id},
	)
	return err
}

// SoftDelete :
func (r Repository) SoftDelete(entityName model.Collection, id primitive.ObjectID) error {
	_, err := r.db.Collection(entityName).UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{"$set": bson.M{
			"deletedAt": time.Now().UTC(),
		}},
		options.Update().SetUpsert(true),
	)
	return err
}

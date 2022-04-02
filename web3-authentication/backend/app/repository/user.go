package repository

import (
	"context"

	"backend/app/model"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// FindUser :
func (r Repository) FindUser(id string) (*model.User, error) {

	v := new(model.User)
	if err := r.db.Collection(model.CollectionUser).FindOne(
		context.Background(),
		bson.M{"_id": id},
	).Decode(v); err != nil {
		return nil, err
	}

	return v, nil
}

// UpsertUser :
func (r Repository) UpsertUser(user *model.User) error {
	_, err := r.db.Collection(model.CollectionUser).UpdateOne(
		context.Background(),
		bson.M{"_id": user.ID},
		bson.M{"$set": user},
		options.Update().SetUpsert(true),
	)
	return err
}

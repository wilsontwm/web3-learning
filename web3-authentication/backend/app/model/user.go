package model

import (
	"time"
)

// User :
type User struct {
	ID        string     `bson:"_id" json:"id"` // Public address of the user
	Name      string     `bson:"name" json:"name"`
	Nonce     string     `bson:"nonce" json:"nonce"`
	DeletedAt *time.Time `bson:"deletedAt" json:"deletedAt"`
	Model     `bson:",inline"`
}

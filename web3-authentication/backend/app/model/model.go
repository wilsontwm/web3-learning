package model

import "time"

// Model :
type Model struct {
	CreatedAt time.Time `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time `bson:"updatedAt" json:"updatedAt"`
}

// Used in context
const (
	ContextLanguage = "language"
	ContextUser     = "user"
)

package transformer

import (
	"time"

	"backend/app/model"
)

// User :
type User struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Nonce     string    `json:"nonce"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ToUser :
func ToUser(i *model.User) (o User) {
	o.ID = i.ID
	o.Name = i.Name
	o.Nonce = i.Nonce
	o.CreatedAt = i.CreatedAt
	o.UpdatedAt = i.UpdatedAt

	return
}

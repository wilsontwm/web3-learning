package model

import "github.com/golang-jwt/jwt"

// UserToken :
type UserToken struct {
	ID   string `json:"id"`
	User User   `json:"user"`
	jwt.StandardClaims
}

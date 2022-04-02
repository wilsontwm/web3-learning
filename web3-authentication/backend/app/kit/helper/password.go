package helper

import (
	"fmt"
	"unicode"

	"golang.org/x/crypto/bcrypt"
)

// GenerateHashPassword :
func GenerateHashPassword(password, salt, pepper []byte) ([]byte, error) {
	passwordPepper := fmt.Sprintf("%s%s%s", password, salt, pepper)
	hashPassword, err := bcrypt.GenerateFromPassword([]byte(passwordPepper), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	return hashPassword, nil
}

// VerifyPassword :
func VerifyPassword(password, salt, pepper, hashedPassword []byte) bool {
	p := []byte(fmt.Sprintf("%s%s%s", password, salt, pepper))
	if err := bcrypt.CompareHashAndPassword(hashedPassword, p); err != nil {
		return false
	}
	return true
}

// CheckPasswordStrength :
func CheckPasswordStrength(s string) bool {
next:
	for _, classes := range map[string][]*unicode.RangeTable{
		"upper case": {unicode.Upper, unicode.Title},
		"lower case": {unicode.Lower},
		"numeric":    {unicode.Number, unicode.Digit},
		"special":    {unicode.Space, unicode.Symbol, unicode.Punct, unicode.Mark},
	} {
		for _, r := range s {
			if unicode.IsOneOf(classes, r) {
				continue next
			}
		}
		return false
	}
	return true
}

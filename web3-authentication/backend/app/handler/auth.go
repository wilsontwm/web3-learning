package handler

import (
	"backend/app/constant"
	"backend/app/env"
	"backend/app/kit/helper"
	"backend/app/model"
	"backend/app/response"
	"backend/app/response/errcode"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/ethereum/go-ethereum/accounts"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"
)

// AuthGenerateNonce :
func (h Handler) AuthGenerateNonce(c echo.Context) error {
	var input struct {
		PublicAddress string `json:"publicAddress" validate:"required"`
	}

	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, response.NewException(c, errcode.InvalidRequest, err))
	}

	if err := c.Validate(&input); err != nil {
		return c.JSON(http.StatusUnprocessableEntity, response.NewException(c, errcode.ValidationError, err))
	}

	// Get the user by public address
	// Create if not exists
	user, err := h.repository.FindUser(input.PublicAddress)
	if err != nil {
		if err != mongo.ErrNoDocuments {
			return c.JSON(http.StatusInternalServerError, response.NewException(c, errcode.SystemError, err))
		}
		user = new(model.User)
		user.ID = input.PublicAddress
		user.Name = "Anonymous"
		user.CreatedAt = time.Now().UTC()
	}
	user.Nonce = helper.RandomString(24)
	user.UpdatedAt = time.Now().UTC()

	if err := h.repository.UpsertUser(user); err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewException(c, errcode.SystemError, err))
	}

	return c.JSON(http.StatusOK, response.Item{
		Item: fmt.Sprintf(constant.SignatureRequestAuth, user.Nonce),
	})
}

// AuthVerifySignature :
func (h Handler) AuthVerifySignature(c echo.Context) error {
	var input struct {
		PublicAddress string `json:"publicAddress" validate:"required"`
		Signature     string `json:"signature" validate:"required"`
	}

	if err := c.Bind(&input); err != nil {
		return c.JSON(http.StatusBadRequest, response.NewException(c, errcode.InvalidRequest, err))
	}

	if err := c.Validate(&input); err != nil {
		return c.JSON(http.StatusUnprocessableEntity, response.NewException(c, errcode.ValidationError, err))
	}

	verifySig := func(from, sigHex string, msg []byte) bool {
		sig := hexutil.MustDecode(sigHex)

		msg = accounts.TextHash(msg)
		sig[crypto.RecoveryIDOffset] -= 27 // Transform yellow paper V from 27/28 to 0/1

		recovered, err := crypto.SigToPub(msg, sig)
		if err != nil {
			return false
		}

		recoveredAddr := crypto.PubkeyToAddress(*recovered)

		return from == recoveredAddr.Hex()
	}

	// Get the user by address
	user, err := h.repository.FindUser(input.PublicAddress)
	if err != nil {
		return c.JSON(http.StatusNotFound, response.NewException(c, errcode.NotFoundError, err))
	}

	nonce := fmt.Sprintf(constant.SignatureRequestAuth, user.Nonce)
	matches := verifySig(input.PublicAddress, input.Signature, []byte(nonce))
	if !matches {
		return c.JSON(http.StatusForbidden, response.NewException(c, errcode.InvalidAccessToken, errors.New("invalid signature")))
	}

	// Change the nonce
	user.Nonce = helper.RandomString(24)
	user.UpdatedAt = time.Now().UTC()

	if err := h.repository.UpsertUser(user); err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewException(c, errcode.SystemError, err))
	}

	token, err := generateUserToken(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, response.NewException(c, errcode.SystemError, err))
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"address": user.ID,
		"token":   token,
	})
}

func generateUserToken(u *model.User) (string, error) {
	timeNow := time.Now()
	claims := new(model.UserToken)
	claims.ID = u.ID
	claims.User = *u
	claims.ExpiresAt = timeNow.Add(438000 * time.Hour).Unix()
	claims.Issuer = "web3-" + env.Config.App.Env
	claims.Audience = "client"
	return jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(env.Config.App.JWTSecretKey))
}

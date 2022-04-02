export GO111MODULE=on
BINARY_NAME=web3-api

all: test build
test:
		go test -v ./...
build:
		GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o $(BINARY_NAME) .

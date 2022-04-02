package env

import (
	"reflect"

	"github.com/caarlos0/env/v6"
)

// Config :
var Config = struct {
	App struct {
		Name         string `env:"APP_NAME,required"`
		Version      string `env:"APP_VERSION,required"`
		Env          string `env:"ENV,required"`
		Port         string `env:"PORT"`
		SystemPath   string `env:"SYSTEM_PATH,required"`
		JWTSecretKey string `env:"JWT_SECRET_KEY,required"`
	}
	Mongo struct {
		Host     string `env:"MONGODB_HOST,required"`
		Username string `env:"MONGODB_USERNAME,required"`
		Password string `env:"MONGODB_PASSWORD,required"`
		DBName   string `env:"MONGODB_DBNAME,required"`
	}
}{}

func init() {
	if err := env.ParseWithFuncs(&Config,
		map[reflect.Type]env.ParserFunc{}); err != nil {
		panic(err)
	}
}

// IsProduction :
func IsProduction() bool {
	return Config.App.Env == "production"
}

// IsSandbox :
func IsSandbox() bool {
	return Config.App.Env == "sandbox"
}

// IsDevelopment :
func IsDevelopment() bool {
	return Config.App.Env == "development"
}

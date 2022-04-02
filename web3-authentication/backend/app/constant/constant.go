package constant

import (
	"backend/app/env"
)

var (
	CORSDomain = []string{env.Config.App.SystemPath, "*"}
)

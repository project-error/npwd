package main

import (
	"github.com/evanw/esbuild/pkg/api"
	"log"
	"os"
)

func main() {
	log.Println("Building server side")
	serverResult := api.Build(api.BuildOptions{
		EntryPoints: []string{"resources/server/server.ts"},
		Outfile:     "resources/dist/server/server.js",
		Bundle:      true,
		Loader:      map[string]api.Loader{".ts": api.LoaderTS, ".js": api.LoaderJS},
		Write:       true,
		LogLevel:    api.LogLevelInfo,
		Color:       api.ColorAlways,
		Platform: api.PlatformNode,
		Target: api.ES2016,
	})
	if len(serverResult.Errors) > 0 {
		os.Exit(1)
	}

	log.Println("Building client side")
	clientResult := api.Build(api.BuildOptions{
		EntryPoints: []string{"resources/client/client.ts"},
		Outfile:     "resources/dist/client/client.js",
		Bundle:      true,
		Loader:      map[string]api.Loader{".ts": api.LoaderTS, ".js": api.LoaderJS},
		Write:       true,
		LogLevel:    api.LogLevelInfo,
		Color:       api.ColorAlways,
		Platform: api.PlatformBrowser,
		Target: api.ES2016,
	})
	if len(clientResult.Errors) > 0 {
		os.Exit(1)
	}
}

fx_version("cerulean")
game("gta5")
description("js runtime monkaW")
authors({ "project error" })
version("3.15.1-beta.2")
client_scripts({
	"client/index.js",
	"client/*.lua",
})

server_script({
	"server/index.js",
})

ui_page("ui/index.html")

files({
	"config.json",
	"ui/assets/**/*.js",
	"ui/index.html",
	"ui/**/*",
})

dependency({
	"screenshot-basic",
	"pma-voice",
})

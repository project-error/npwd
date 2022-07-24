fx_version "cerulean"
game "gta5"
description 'js runtime monkaW'
authors { "itschip",  "erik-sn", "TasoOneAsia", "kidz", "RockySouthpaw"}
version '1.2.99'

client_scripts {
    'resources/dist/client/client.js',
    'resources/client/*.lua'
}

server_scripts {
    -- This is a file that lives purely in source code and isn't compiled alongside
    -- rest of the release. It's used to detect whether a user can read or not.
    'build-detector.js',
    'resources/dist/server/server.js',
    '@oxmysql/lib/MySQL.lua',
    'resources/server/events.lua'
}

ui_page 'resources/html/index.html'

files {
    'config.json',
    'resources/html/index.html',
    'resources/html/**/*',
}

dependency {
	'screenshot-basic',
  'pma-voice',

}

exports{
    "getBalance"

}
fx_version "cerulean"
game "gta5"
description 'js runtime monkaW'
authors { "itschip",  "erik-sn", "TasoOneAsia", "kidz", "RockySouthpaw"}

client_script {
    'resources/dist/client/*.client.js'
}

server_script {
    'resources/dist/server/*.server.js'
}

ui_page 'resources/html/index.html'

files {
    'resources/html/index.html',
    'resources/html/*.js',
    'resources/html/*.map',
    'resources/html/media/**/*'
}

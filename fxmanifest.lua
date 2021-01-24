fx_version "adamant"
game "gta5"
description 'new-phone-who-dis'
authors { "itschip",  "erik-sn", "TasoOneAsia", "jfrader", "RockySouthpaw"}

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
    'resources/html/media/frames/*.png',
    'resources/html/media/backgrounds/*.png',
    'resources/html/media/backgrounds/*.jpg',
    'resources/html/media/twitter/*'
}

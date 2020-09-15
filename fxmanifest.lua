fx_version "adamant"
game "gta5"
description 'New-PHone-Who-Dis'
author { "chip", "BTNGaming", "ROCKY_southpaw" }

client_script {
    '@es_extended/locale.lua',
    'resources/locales/*.lua',
    'resources/client/*lua'
}

shared_script {
    'resources/config.lua'
}

server_script {
    "@mysql-async/lib/MySQL.lua",
    '@es_extended/locale.lua',
    'resources/locales/*.lua',
    'resources/server/*.lua'
}

ui_page 'resources/html/index.html'

files {
    'resources/html/index.html',
    'resources/html/*.js',
    'resources/html/media/frames/*.png',
    'resources/html/media/backgrounds/*.png',
    'resources/html/media/backgrounds/*.jpg'
}
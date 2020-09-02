fx_version "adamant"
game "gta5"
description 'New-PHone-Who-Dis'

client_script {
    '@es_extended/locale.lua',
    'resources/locales/*.lua',
    'resources/config.lua',
    'resources/client/cl_main.lua',
    'resources/client/cl_contacts.lua'
}

server_script {
    "@mysql-async/lib/MySQL.lua",
    '@es_extended/locale.lua',
    'resources/locales/*.lua',
    'resources/config.lua',
    'resources/server/sv_main.lua',
    'resources/server/sv_contacts.lua'
}

ui_page 'resources/html/index.html'

files {
    'resources/html/index.html',
    'resources/html/main.js',
    'resources/html/media/frames/*.png',
    'resources/html/media/backgrounds/*.png',
    'resources/html/media/backgrounds/*.jpg'
}
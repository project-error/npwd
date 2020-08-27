fx_version "adamant"
game "gta5"

client_script {
    'resources/client/cl_main.lua'
}

server_script {
    "@mysql-async/lib/MySQL.lua",
    'resources/server/sv_main.lua'
}

ui_page 'resources/html/index.html'

files {
    'resources/html/index.html',
    'resources/html/main.js'
}
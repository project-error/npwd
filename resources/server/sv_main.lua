ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) 
    ESX = obj 
end)


-- we pass the server configuration to the phone so that we can have phone or
-- app specific settings configured by the server owner
ESX.RegisterServerCallback('phone:phoneConfig', function(source, cb)
    cb(Config)
end)


RegisterServerEvent('phone:getCredentials')
AddEventHandler('phone:getCredentials', function()
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    MySQL.Async.fetchAll('SELECT phone_number FROM users WHERE `identifier`=@identifier', 
    {
        ['@identifier'] = _identifier
    },  
        function(result)
            for k,v in pairs(result) do
                print(v.phone_number)
                number = v.phone_number
            end
        TriggerClientEvent('phone:sendCredentials', _source, number)
    end)
    TriggerClientEvent('phone:send', _source)
end)

RegisterCommand('getnumber', function(source, args)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    print(_identifier)
end)

ESX.RegisterServerCallback('phone:getItemAmount', function(source, cb, item)
    local xPlayer = ESX.GetPlayerFromId(source)
    local items = xPlayer.getInventoryItem(item)

    if items == nil then
        cb(0)
    else
        cb(items.count)
    end
end)
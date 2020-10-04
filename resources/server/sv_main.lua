ESX = nil
db = DatabaseConfig  -- helper variable for use in server functions

TriggerEvent('esx:getSharedObject', function(obj) 
    ESX = obj 
end)


RegisterServerEvent('phone:getCredentials')
AddEventHandler('phone:getCredentials', function()
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    MySQL.Async.fetchAll('SELECT ' .. db.phoneNumber .. ' AS phone_number FROM ' .. db.userTable .. ' WHERE ' .. db.id .. '=@identifier', 
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

----
--Destroy Phone
--

ESX.RegisterServerCallback('phone:removephone', function(source, cb, item)
    local xPlayer = ESX.GetPlayerFromId(source)
    local items = xPlayer.getInventoryItem(item)

    if items == nil then
        cb(0)
    else
        cb(items.count)
        if items.count > 0 then
            xPlayer.removeInventoryItem('phone', items.count)
            xPlayer.addInventoryItem('dphone', items.count)
        end
    end
end)
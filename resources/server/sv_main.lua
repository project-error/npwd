ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) 
    ESX = obj 
end)

--RegisterCommand('server_getnumber', function(source, args, rawCommand)
--    TriggerEvent('phone:server:getCredentials', source)
--end, false)

RegisterServerEvent('phone:server:getCredentials')
AddEventHandler('phone:server:getCredentials', function(source)
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
                local number = v.phone_number
                TriggerClientEvent('phone:client:sendCredentials', _source, number)
            end
    end)
end)
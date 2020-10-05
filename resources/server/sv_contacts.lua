ESX = nil

TriggerEvent('esx:getSharedObject', function(obj) 
    ESX = obj 
end)

ESX.RegisterServerCallback('phone:getContacts', function(source, cb)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    MySQL.Async.fetchAll('SELECT * FROM npwd_phone_contacts WHERE `identifier`=@identifier', 
    {
        ['@identifier'] = _identifier
    }, function(contacts)
        cb(contacts)
        print("Contacts:")
        for k,v in pairs(contacts) do
            print(v.number, v.display)
        end
    end)
end)

RegisterServerEvent('phone:addContacts')
AddEventHandler('phone:addContacts', function(display, number)
    local _source = source
    local xPlayer = ESX.GetPlayerFromId(_source)
    local _identifier = xPlayer.getIdentifier()
    print(display, number)
    MySQL.Async.execute('INSERT INTO npwd_phone_contacts (`identifier`, `number`, `display`) VALUES (@identifier, @number, @display)', 
    {  
        identifier = _identifier,
        number = number,
        display = display
    }, function()
    end)
end)

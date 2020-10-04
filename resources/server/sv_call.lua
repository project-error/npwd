ESX = nil
db = DatabaseConfig  -- helper variable for use in server functions

TriggerEvent(
    "esx:getSharedObject",
    function(obj)
        ESX = obj
    end
)

function getIdentifierByNumber(phoneNumber) 
    local result = MySQL.Sync.fetchAll("SELECT " .. db.id .. " AS identifier FROM " .. db.userTable .. " WHERE " .. db.phoneNumber .. " = @phone_number", {
        ['@phone_number'] = phoneNumber
    })
    if result[1] ~= nil then
        return result[1].identifier
    end
    return nil
end

function getPhoneNumber(identifier) 
    local result = MySQL.Sync.fetchAll("SELECT " .. db.phoneNumber .. " AS phone_number FROM " .. db.userTable .. " WHERE " .. db.id .. " = @identifier", {
        ['@identifier'] = identifier
    })
    if result[1] ~= nil then
        return result[1].phone_number
    end
    return nil
end

function getSourceFromIdentifier(identifier, cb)
	local xPlayers = ESX.GetPlayers()
	for i=1, #xPlayers, 1 do
		local xPlayer = ESX.GetPlayerFromId(xPlayers[i])
		if(xPlayer.identifier ~= nil and xPlayer.identifier == identifier) or (xPlayer.identifier == identifier) then
			cb(xPlayer.source)
			return
		end
	end
	cb(nil)
end

function getPlayerID(source)
    local identifiers = GetPlayerIdentifiers(source)
    local player = getIdentifiant(identifiers)
    return player
end

function getIdentifiant(id)
    for _, v in ipairs(id) do
        return v
    end
end

RegisterServerEvent('phone:startCall')
AddEventHandler('phone:startCall', function(phoneNumber)
    local _source = source
    TriggerEvent('phone:initalizeCall', _source, phoneNumber)
end)

--[[RegisterServerEvent('phone:initalizeCall')
AddEventHandler('phone:initalizeCall', function(phoneNumber)
    local sourcePlayer = tonumber(source)
    local zPlayer = getIdentifierByNumber(phoneNumber)
    if zPlayer ~= nil then
        getSourceFromIdentifier(zPlayer, function(target)
            if tonumber(target) ~= nil then
                print('Target: ' .. target)
            end
        end)
    end
end)]]

RegisterServerEvent('phone:initalizeCall')
AddEventHandler('phone:initalizeCall', function(source, phoneNumber)
    if phoneNumber == nil or phoneNumber == '' then 
        print('Number not Valid')
        return
    end

    local sourcePlayer = tonumber(source)
    local srcIdentifier = getPlayerID(source)

    local srcPhone = ''

    local zPlayer = getIdentifierByNumber(phoneNumber)
    local is_valid = zPlayer ~= nil and zPlayer ~= srcIdentifier
    
    if is_valid == true then
        getSourceFromIdentifier(zPlayer, function (target)
            if target ~= nil then
                TriggerClientEvent('phone:waitingCall', sourcePlayer, phoneNumber, true) -- Is calling
                TriggerClientEvent('phone:waitingCall', target, phoneNumber, false) -- Calling
            else
                TriggerClientEvent('phone:waitingCall', sourcePlayer, phoneNumber, true)
            end
        end)
    else
        TriggerClientEvent('phone:waitingCall', sourcePlayer, phoneNumber, true)
    end
end)



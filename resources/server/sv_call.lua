ESX = nil

TriggerEvent(
    "esx:getSharedObject",
    function(obj)
        ESX = obj
    end
)


function getIdentifierByNumber(phoneNumber) 
    local result = MySQL.Sync.fetchAll("SELECT users.identifier FROM users WHERE users.phone_number = @phone_number", {
        ['@phone_number'] = phoneNumber
    })
    if result[1] ~= nil then
        return result[1].identifier
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
    TriggerEvent('phone:initalizeCall', phoneNumber)
end)

RegisterServerEvent('phone:initalizeCall')
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
end)
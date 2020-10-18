ESX = nil

TriggerEvent(
  "esx:getSharedObject",
  function(obj)
      ESX = obj
  end
)

function getIdentifierByNumber(phoneNumber) 
  local result = MySQL.Sync.fetchAll("SELECT identifier FROM users WHERE phone_number = @phone_number", {
    ['@phone_number'] = phoneNumber
  })
  if result[1] ~= nil then
      return result[1].identifier
  end
  return nil
end

function getPhoneNumber(identifier) 
  local result = MySQL.Sync.fetchAll("SELECT users.phone_number FROM users WHERE users.identifier = @identifier", {
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

RegisterServerEvent('phone:beginCall')
AddEventHandler('phone:beginCall', function(phoneNumber)
  local _source = source
  local xPlayer = ESX.GetPlayerFromId(_source)
  local _identifier = xPlayer.getIdentifier()
  local callerName = xPlayer.getName()
  local callerNumber = getPhoneNumber(_identifier);

  
  local targetIdentifier = getIdentifierByNumber(phoneNumber)
  getSourceFromIdentifier(targetIdentifier, function(target)
    local xTarget = ESX.GetPlayerFromId(target)
    local targetName = xTarget.getName()
    TriggerClientEvent('phone:startCall', target, callerName, callerNumber, _source)
    TriggerClientEvent('phone:startCall', _source, targetName, phoneNumber, target)
  end)
end)

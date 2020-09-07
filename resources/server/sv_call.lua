ESX = nil

TriggerEvent(
    "esx:getSharedObject",
    function(obj)
        ESX = obj
    end
)

function getSourceFromIdentifier(identifier, cb)
    TriggerEvent("es:getPlayers", function(users)
        for k , user in pairs(users) do
            if (user.getIdentifier ~= nil and user.getIdentifier() == identifier) or (user.identifier == identifier) then
                cb(k)
                return
            end
        end
    end)
    cb(nil)
end

function getIdentifierByNumber(phoneNumber)
    local result = MySQL.Sync.fetchAll("SELECT users.identifier FROM users WHERE users.phone_number = @phone_number", {
        ['@phone_number'] = phoneNumber
    })
    if result[1] ~= nil then
        print(result[1].identifier)
        return result[1].identifier
    end
    return nil
end

RegisterServerEvent('phone:initalizeCall')
AddEventHandler('phone:initalizeCall', function(phoneNumber)
    local zPlayer = getIdentifierByNumber(phoneNumber)
    print(zPlayer)
    getSourceFromIdentifier(zPlayer, function(target)
        print(tonumber(target))
    end)
end)



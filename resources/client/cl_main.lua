ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)

--RegisterCommand('phone:get', function(source, args, rawCommand)
--    TriggerServerEvent('phone:server:getCredentials')
--end, false)

RegisterCommand('phone:open', function(source, args, rawCommand)
    TriggerServerEvent('phone:server:getCredentials')
end, false)

RegisterNetEvent('phone:client:send')
AddEventHandler('phone:client:send', function()
    SendNUIMessage(
        {
         app = 'PHONE',
         method = 'setVisibility',
         data = true
        }
    )
    SetNuiFocus(true, true)
end)

RegisterCommand('phone:hide', function(source, args, rawCommand)
    SendNUIMessage(
        {
         app = 'PHONE',
         method = 'setVisibility',
         data = false
        }
    )
    SetNuiFocus(false, false)
end, false)

RegisterNetEvent('phone:client:sendCredentials')
AddEventHandler('phone:client:sendCredentials', function(number)
    print(number)
    SendNUIMessage(
        {
            app = "SIMCARD",
            method = "setNumber",
            data = number
        }
    )
end)
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
    TriggerServerEvent('phone:getCredentials', source)
end, false)

RegisterNetEvent('phone:send')
AddEventHandler('phone:send', function()
    SendNUIMessage(
        {
         app = 'PHONE',
         method = 'setVisibility',
         data = true
        }
    )
    SetNuiFocus(true, true)
    TriggerEvent('phone:sendContacts')
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

RegisterNUICallback('phone:close', function()
    SendNUIMessage(
        {
         app = 'PHONE',
         method = 'setVisibility',
         data = false
        }
    )
    SetNuiFocus(false, false)
end)

RegisterNetEvent('phone:sendCredentials')
AddEventHandler('phone:sendCredentials', function(number)
    print(number)
    SendNUIMessage(
        {
            app = "SIMCARD",
            method = "setNumber",
            data = number
        }
    )
end)
ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)
------------------------------------------------------------------------ End of ESX

--RegisterCommand('phone:get', function(source, args, rawCommand)
--    TriggerServerEvent('phone:server:getCredentials')
--end, false)

local isPhoneOpen = false

RegisterCommand('phone', function(source) -- Toggles Phone
    TriggerServerEvent('phone:getCredentials', source) 
    if isPhoneOpen == false then 
        isPhoneOpen = true 
        print("phone is now open") --Left for testing purposes. 
        SendNUIMessage( -- Shows phone
            {
            app = 'PHONE',
            method = 'setVisibility',
            data = true
            }
        )
        SetNuiFocus(true, true)
    else
        isPhoneOpen = false
        print("phone is now closed") --Left for testing purposes. 
        SendNUIMessage( -- Hides phone
            {
             app = 'PHONE',
             method = 'setVisibility',
             data = false
            }
        )
        SetNuiFocus(false, false)
    end
end, false)


RegisterNetEvent('phone:send')
AddEventHandler('phone:send', function()
    TriggerEvent('phone:sendContacts')
end)

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
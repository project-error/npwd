ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)

RegisterNUICallback('phone:startCall', function(data)
    print('Calling ' .. data.number)
    local phoneNumber = data.number
    TriggerServerEvent('phone:initalizeCall', phoneNumber)
end)




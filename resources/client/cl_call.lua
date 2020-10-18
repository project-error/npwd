ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)

RegisterNUICallback('phone:startCall', function(data)
  local phoneNumber = data.number
  TriggerServerEvent('phone:beginCall', phoneNumber)
end)

RegisterNetEvent('phone:startCall')
AddEventHandler('phone:startCall', function(partner, phoneNumber, id)
  print('You are talking to ' .. partner .. ', who has the number: ' .. phoneNumber);
  exports["mumble-voip"]:SetCallChannel(id+1)
end)

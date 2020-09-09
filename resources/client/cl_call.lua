ESX = nil
  
Citizen.CreateThread(function()
  while ESX == nil do
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
    Citizen.Wait(0)
  end
end)

RegisterNUICallback('phone:startCall', function(data)
    print('Start call with ' .. data.number)
    local phoneNumber = data.number
    startCall(phoneNumber)
end)

--[[RegisterCommand('answer', function(source) -- Toggles Phone
  if isPhoneOpen == false then 

end, false)]]

function startCall (phoneNumber)
  TriggerServerEvent('phone:startCall', phoneNumber)
end

function acceptCall (phoneNumber)
  TriggerServerEvent('phone:acceptCall', infoCall, rtcAnswer)
end

function rejectCall(phoneNumber)
  TriggerServerEvent('phone:rejectCall', infoCall)
end

RegisterNetEvent('phone:waitingCall')
AddEventHandler('phone:waitingCall', function(phoneNumber)
  local playerPed = PlayerPedId()
  print(phoneNumber)
  print("oi")
  TriggerServerEvent('InteractSound_SV:PlayWithinDistance', 0.5, 'cellCall', 0.4)
end)